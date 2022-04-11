import { Octokit } from '@octokit/rest';

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
  diffSize: number;
};

// useful to see reason why if not valid
type ValidationResult = {
  status: 'valid' | 'invalid' | 'pending';
  reason?: string;
};

/** Parses GitHub PR `url` for information necessary to make API calls.
 *  Raises an error if URL is malformed. */
const parseGithubUrl = (url: string): PullRequest => {
  // of the form: https://github.com/cornell-dti/idol/pull/266
  const pattern = /.*github.com\/([_a-zA-Z0-9-]+)\/([_a-zA-Z0-9-]+)\/pull\/([0-9]+)/;

  const match = url.match(pattern);
  if (match == null) {
    throw new Error(`Malformed URL ${url}.`); // more helpful error message?
  }

  return { owner: match[1], repo: match[2], pull_number: parseInt(match[3], 10) };
};

/** Returns tuple of earliest valid time, deadline, and Idol member github username.
 *  Raises an error if the Idol member from `submission` does not have a github username. */
const parsePortfolioSubmission = (portfolio: DevPortfolio, submission: DevPortfolioSubmission) => {
  const start = portfolio.earliestValidDate;
  const end = portfolio.deadline;
  const username = submission.member.github; // must be github username

  // check github user
  if (!username) {
    const name = `${submission.member.firstName} ${submission.member.lastName}`;
    const netid = `${submission.member.netid}`;

    throw new Error(`Idol member ${name} (${netid}) does not have a github username.`);
  }

  return { start, end, username };
};

/** Retrieves review comments made on `pull_request`. */
const getReviewComments = async (pull: PullRequest): Promise<Comment[]> => {
  const octokit = new Octokit();

  return octokit.rest.pulls.listReviewComments(pull).then((res) => {
    // handle non 200 response?

    const comments = res.data;
    return comments.map(
      (comment): Comment => ({
        commentUrl: comment.html_url,
        createdBy: comment.user.login,
        createdAt: Date.parse(comment.created_at),
        content: comment.body
      })
    );
  });
};

/** Retrieves non-review comments made on `pull_request`. */
const getNonReviewComments = async (pull: PullRequest): Promise<Comment[]> => {
  const octokit = new Octokit();

  // non-review comments are classified as "issue" comments
  return octokit.rest.issues
    .listComments({ ...pull, issue_number: pull.pull_number })
    .then((res) => {
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
};

/** Returns `comments` created by `username` between `start_time` and `end_time`.
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
  eligibleComments = comments.filter((comment) => comment.createdBy === username);
  if (!eligibleComments || !eligibleComments.length) {
    throw new Error(`No review comments made by user ${username} in this PR.`);
  }

  // comments made in date range
  eligibleComments = eligibleComments.filter(
    (comment) => startTime <= comment.createdAt && comment.createdAt <= endTime
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

/** Retrieves information about `pull_request` and its review comments. */
const getReviewedPR = async (pull: PullRequest): Promise<ReviewedPR> => {
  const octokit = new Octokit();

  // get information about a PR and its review comments
  // cannot get both with a single api call
  return Promise.all([octokit.rest.pulls.get(pull), getReviewComments(pull)]).then(
    ([pr, comments]) => ({
      url: pr.data.html_url,
      createdBy: pr.data.user?.login || '',
      comments
    })
  );
};

/** Retrieves information about opened PR `pull_request`. */
const getOpenedPR = async (pull: PullRequest): Promise<OpenedPR> => {
  const octokit = new Octokit();

  return Promise.all([octokit.rest.pulls.get(pull), getNonReviewComments(pull)]).then(
    ([pr, comments]) => {
      // get any comments by dti bot
      const botComments = filterComments(comments, 'dti-github-bot', 0, Number.MAX_SAFE_INTEGER);

      let diffSize = 0;
      botComments.forEach((comment) => {
        const match = comment.content.match(/.*\[diff-counting\] Significant lines: ([0-9]+).*/);
        if (match == null) {
          throw new Error(`No significant line count by dti-github-bot for PR ${pr.data.url}.`);
        }
        diffSize = parseInt(match[1], 10);
      });

      return {
        url: pr.data.html_url,
        createdBy: pr.data.user?.login || '',
        createdAt: Date.parse(pr.data.created_at),
        diffSize
      };
    }
  );
};

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
  return { status: 'valid' };
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
    if (review.createdBy === username) {
      throw new Error(`Cannot use PR ${review.url} opened by user for review requirement.`);
    }

    // comments made by user within the date range
    const eligibleComments = filterComments(review.comments, username, start, end);

    // placeholder logic: valid if at least 10 words total
    const totalWordCount = eligibleComments.reduce(
      (count, comment) => count + comment.content.split(' ').length,
      0
    );
    if (totalWordCount < 10) {
      throw new Error('Trivial review.');
    }
  });

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

    if (open.createdBy !== username) {
      throw new Error(`User ${username} did not open the pull request ${open.url}.`);
    }

    if (start >= open.createdAt && open.createdAt >= end) {
      const startDate = new Date(start).toDateString();
      const endDate = new Date(end).toDateString();
      throw new Error(`Pull request ${open.url} was not made between ${startDate} and ${endDate}.`);
    }

    // placeholder logic: valid if at least 10 changes total
    if (open.diffSize < 10) {
      throw new Error('Trivial PR.');
    }
  });

/** ="at least one of `results` is valid" */
const atLeastOneValid = (results: ValidationResult[]) =>
  results.some((result) => result.status === 'valid');

/** Determines whether submission is valid or invalid. */
const validateSubmission = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission
): Promise<DevPortfolioSubmission> => {
  const reviewResults = await Promise.all(
    submission.reviewedPRs.map(async (url) => validateReview(portfolio, submission, url))
  );

  const openedResults = await Promise.all(
    submission.openedPRs.map(async (url) => validateOpen(portfolio, submission, url))
  );

  const status =
    atLeastOneValid(reviewResults) && atLeastOneValid(openedResults) ? 'valid' : 'invalid';
  return { ...submission, status };
};

export default validateSubmission;
