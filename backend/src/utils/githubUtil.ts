import { Octokit } from '@octokit/rest';

// authenticated with PAT so rate limit increased
const octokit = new Octokit({
  auth: process.env.GITHUB_VALIDATION_TOKEN
});

type PullRequest = {
  owner: string;
  repo: string;
  pull_number: number; // github API field is snakecase
};

type Comment = {
  commentUrl: string;
  createdBy: string;
  createdAt: number;
  content: string;
};

type ReviewedPR = {
  url: string;
  createdBy: string;
  comments: Comment[];
};

type OpenedPR = {
  url: string;
  createdBy: string;
  createdAt: number;
};

type ValidationResult = {
  status: SubmissionStatus;
  reason?: string | null;
};

/** Parses GitHub PR `url` for information necessary to make API calls.
 *  Raises an error if URL is malformed. */
const parseGithubUrl = (url: string): PullRequest => {
  // of the form: https://github.com/cornell-dti/idol/pull/266
  const pattern = /.*github.com\/([._a-zA-Z0-9-]+)\/([._a-zA-Z0-9-]+)\/pull\/([0-9]+).*/;

  const match = url.match(pattern);
  if (match == null) {
    throw new Error(`Malformed URL ${url}.`); // more helpful error message?
  }

  return { owner: match[1], repo: match[2], pull_number: parseInt(match[3], 10) };
};

/** Returns GitHub username from profile `url`.
 *  Raises an error if URL is malformed. */
const parseGithubUsername = (url: string): string => {
  // of the form: https://github.com/JacksonStaniec
  const pattern = /.*github.com\/([._a-zA-Z0-9-]+).*/;

  const match = url.match(pattern);
  if (match == null) {
    throw new Error(`Malformed URL ${url}.`);
  }

  return match[1];
};

/** Returns tuple of earliest valid time, deadline, and Idol member github username.
 *  Raises an error if the Idol member from `submission` does not have a github username. */
const parsePortfolioSubmission = (portfolio: DevPortfolio, submission: DevPortfolioSubmission) => {
  const start = portfolio.earliestValidDate;
  const end = portfolio.lateDeadline ? portfolio.lateDeadline : portfolio.deadline;
  const usernameUrl = submission.member.github;

  // check github user
  if (!usernameUrl) {
    const name = `${submission.member.firstName} ${submission.member.lastName}`;
    const netid = `${submission.member.netid}`;

    throw new Error(`Idol member ${name} (${netid}) does not have a github username.`);
  }

  const username = parseGithubUsername(usernameUrl);

  return { start, end, username };
};

/** Retrieves review comments made on `pull`. */
const getReviewComments = async (pull: PullRequest): Promise<Comment[]> =>
  Promise.all([
    octokit.rest.pulls.listReviewComments(pull),
    octokit.rest.pulls.listReviews(pull)
  ]).then(([reviewCommentsRes, approvalCommentsRes]) => {
    // extract information necessary to make a Comment object
    // works for both review comments and approval comments
    const toComment = (data): Comment => ({
      commentUrl: data.html_url,
      createdBy: data.user.login,
      createdAt: Date.parse(data.created_at) || Date.parse(data.submitted_at),
      content: data.body
    });

    const reviewComments = reviewCommentsRes.data;
    const approvalComments = approvalCommentsRes.data.filter((comment) => comment.body !== ''); // most are empty

    // combine comments
    return reviewComments
      .map((comment) => toComment(comment))
      .concat(approvalComments.map((comment) => toComment(comment)));
  });

/** Retrieves non-review comments made on `pull`. */
const getNonReviewComments = async (pull: PullRequest): Promise<Comment[]> =>
  // non-review comments are classified as "issue" comments
  octokit.rest.issues.listComments({ ...pull, issue_number: pull.pull_number }).then((res) => {
    const comments = res.data;
    return comments.map(
      (comment): Comment => ({
        commentUrl: comment.html_url,
        createdBy: comment.user?.login || '',
        createdAt: Date.parse(comment.created_at),
        content: comment.body || ''
      })
    );
  });

/** ="`time` is between the date range `start` to `end`." */
export const isWithinDates = (time: number, start: number, end: number): boolean =>
  start <= time && time <= end;

/** Returns `comments` created by `username` between `startTime` and `endTime`.
 *  Raises an error if no comment satisfies these conditions. */
const filterComments = (
  comments: Comment[],
  username: string,
  startTime: number,
  endTime: number
): Comment[] => {
  if (!comments || !comments.length) {
    throw new Error(`No review comments in this PR.`);
  }

  let eligibleComments: Comment[] = [];

  // comments made by user
  eligibleComments = comments.filter(
    (comment) => comment.createdBy.toLowerCase() === username.toLowerCase()
  );
  if (!eligibleComments || !eligibleComments.length) {
    throw new Error(`No review comments made by user ${username} in this PR.`);
  }

  // comments made in date range
  eligibleComments = eligibleComments.filter((comment) =>
    isWithinDates(comment.createdAt, startTime, endTime)
  );
  if (!eligibleComments || !eligibleComments.length) {
    const startDate = new Date(startTime).toDateString();
    const endDate = new Date(endTime).toDateString();
    throw new Error(
      `No review comments made by user ${username} between ${startDate} and ${endDate}.`
    );
  }

  return eligibleComments;
};

/** Retrieves information about `pull` and its review comments. */
const getReviewedPR = async (pull: PullRequest): Promise<ReviewedPR> =>
  // get information about a PR and its review comments
  // cannot get both with a single api call
  Promise.all([
    octokit.rest.pulls.get(pull),
    getReviewComments(pull),
    getNonReviewComments(pull) // use "thread" comments in consideration as well
  ]).then(([pr, reviewComments, nonReviewComments]) => ({
    url: pr.data.html_url,
    createdBy: pr.data.user?.login || '',
    comments: reviewComments.concat(nonReviewComments)
  }));

/** Retrieves information about opened PR `pull`. */
const getOpenedPR = async (pull: PullRequest): Promise<OpenedPR> =>
  octokit.rest.pulls.get(pull).then((pr) => ({
    url: pr.data.html_url,
    createdBy: pr.data.user?.login || '',
    createdAt: Date.parse(pr.data.created_at)
  }));

/** Creates 'valid' result if no errors are raised, 'invalid' result otherwise.  */
const createValidationResult = async (validationFunction): Promise<ValidationResult> => {
  try {
    await validationFunction();
  } catch (err) {
    if (err instanceof Error) {
      return {
        status: 'invalid',
        reason: err.message
      };
    }
  }

  // if no errors encountered, then valid submission
  return { status: 'valid', reason: null };
};

/** Determines whether PR review is valid. */
const validateReview = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission,
  reviewUrl: string
): Promise<ValidationResult> =>
  createValidationResult(async () => {
    // get information from submission
    const { start, end, username } = parsePortfolioSubmission(portfolio, submission);

    // get review object
    const review = await getReviewedPR(parseGithubUrl(reviewUrl));

    // cannot review own PR
    if (review.createdBy.toLowerCase() === username.toLowerCase()) {
      throw new Error(`Cannot use PR ${review.url} opened by user for review requirement.`);
    }

    // comments made by user within the date range
    const eligibleComments = filterComments(review.comments, username, start, end);

    if (reviewIsTrivial(eligibleComments)) {
      throw new Error('Trivial review.');
    }
  });

/** Returns `comments` with duplicate content from quote replies removed. */
const removeQuoted = (comments: Comment[]): Comment[] => {
  // quote replies are of the form "> (original comment)\r\n(new comment)"
  const quotePattern = />(.*?)\r\n/gs;
  return comments.map((comment) => ({
    ...comment,
    content: comment.content.replace(quotePattern, '').trim()
  }));
};

/** ="this collection of comments constitutes a trivial review" */
const reviewIsTrivial = (comments: Comment[]): boolean => {
  const totalWordCount = removeQuoted(comments).reduce((count, comment) => {
    // get alphanumeric words
    const words = comment.content.split(' ').filter((s) => s.replace(/[\W_-]/g, ''));
    return count + words.length;
  }, 0);

  return totalWordCount < 10;
};

/** Determines whether an open PR is valid. */
const validateOpen = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission,
  openUrl: string
): Promise<ValidationResult> =>
  createValidationResult(async () => {
    // get information from submission
    const { start, end, username } = parsePortfolioSubmission(portfolio, submission);

    // get open object
    const open = await getOpenedPR(parseGithubUrl(openUrl));

    // case-insensitive compare in case URL removes capitalization
    if (open.createdBy.toLowerCase() !== username.toLowerCase()) {
      throw new Error(`User ${username} did not open the pull request ${open.url}.`);
    }

    if (!isWithinDates(open.createdAt, start, end)) {
      const startDate = new Date(start).toDateString();
      const endDate = new Date(end).toDateString();
      throw new Error(`Pull request ${open.url} was not made between ${startDate} and ${endDate}.`);
    }
  });

/** Determines the overall status of the submission. */
export const getSubmissionStatus = (submission: DevPortfolioSubmission): SubmissionStatus => {
  // if text area populated, set to pending
  if (submission.text) {
    return 'pending';
  }

  // otherwise, valid if at least one valid in each category
  const atLeastOneValid =
    submission.openedPRs.some((pr) => pr.status === 'valid') &&
    submission.reviewedPRs.some((pr) => pr.status === 'valid');

  return atLeastOneValid ? 'valid' : 'invalid';
};

/** Determines whether submission is valid or invalid. */
export const validateSubmission = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission
): Promise<DevPortfolioSubmission> => {
  const reviewedResults = await Promise.all(
    submission.reviewedPRs.map(async (pr) => ({
      ...pr,
      ...(await validateReview(portfolio, submission, pr.url))
    }))
  );

  const openedResults = await Promise.all(
    submission.openedPRs.map(async (pr) => ({
      ...pr,
      ...(await validateOpen(portfolio, submission, pr.url))
    }))
  );

  const updatedSubmission = {
    ...submission,
    openedPRs: openedResults,
    reviewedPRs: reviewedResults
  };

  return { ...updatedSubmission, status: getSubmissionStatus(updatedSubmission) };
};

export default validateSubmission;
