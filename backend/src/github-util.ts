import { Octokit } from '@octokit/rest';

type PullRequest = {
  owner: string;
  repo: string;
  pull_number: number;
};

type ReviewComment = {
  comment_url: string;
  created_by: string;
  created_at: number;
  content: string;
};

type ReviewedPR = {
  url: string;
  created_by: string;
  comments: ReviewComment[];
};

type OpenedPR = {
  url: string;
  created_by: string;
  created_at: number;
  diff_size: number;
};

// useful to see reason why if not valid
type ValidationResult = {
  status: 'valid' | 'invalid' | 'pending';
  reason?: string;
};

/** Parses GitHub PR `url` for information necessary to make API calls.
 *  Raises an error if URL is malformed.
 */
const parse_github_url = (url: string): PullRequest => {
  // of the form: https://github.com/cornell-dti/idol/pull/266
  const pattern = /.*github.com\/([_a-zA-Z0-9-]+)\/([_a-zA-Z0-9-]+)\/pull\/([0-9]+)/;

  const match = url.match(pattern);
  if (match == null) {
    throw new Error(`Malformed URL ${url}.`); // more helpful error message?
  }

  return { owner: match[1], repo: match[2], pull_number: parseInt(match[3], 10) };
};

/** Retrieves comments made on `pull_request`. */
const GetReviewComments = async (pull_request: PullRequest): Promise<ReviewComment[]> => {
  const octokit = new Octokit();

  return octokit.rest.pulls.listReviewComments(pull_request).then((res) => {
    // handle non 200 response?

    const prs = res.data;
    return prs.map(
      (pr): ReviewComment => ({
        comment_url: pr.html_url,
        created_by: pr.user.login,
        created_at: Date.parse(pr.created_at),
        content: pr.body
      })
    );
  });
};

/** Retrieves information about `pull_request` and its review comments. */
const GetReviewedPR = async (pull_request: PullRequest): Promise<ReviewedPR> => {
  const octokit = new Octokit();

  // get information about a PR and its review comments
  // cannot get both with a single api call
  return Promise.all([octokit.rest.pulls.get(pull_request), GetReviewComments(pull_request)]).then(
    ([pr, comments]) => ({
      url: pr.data.html_url,
      created_by: pr.data.user?.login || '',
      comments
    })
  );
};

/** Returns `comments` created by `username` between `start_time` and `end_time`.
 *  Raises an error if no comment satisfies these conditions.
 */
const FilterComments = (
  comments: ReviewComment[],
  username: string,
  start_time: number,
  end_time: number
): ReviewComment[] => {
  if (!comments || !comments.length) {
    throw new Error(`No review comments in this PR.`);
  }

  let eligible_comments: ReviewComment[] = [];

  // comments made by user
  eligible_comments = comments.filter((comment) => comment.created_by === username);
  if (!eligible_comments || !eligible_comments.length) {
    throw new Error(`No review comments made by user ${username} in this PR.`);
  }

  // comments made in date range
  eligible_comments = eligible_comments.filter(
    (comment) => start_time <= comment.created_at && comment.created_at <= end_time
  );
  if (!eligible_comments || !eligible_comments.length) {
    const start_date = new Date(start_time).toDateString();
    const end_date = new Date(end_time).toDateString();
    throw new Error(
      `No review comments made by user ${username} between ${start_date} and ${end_date}.`
    );
  }

  return eligible_comments;
};

/** Determines whether PR review is valid. */
const ValidateReview = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission,
  review_url: string
): Promise<ValidationResult> => {
  const start = portfolio.earliestValidDate;
  const end = portfolio.deadline;
  const username = submission.member.github || ''; // must be github username

  try {
    // get review object
    const review = await GetReviewedPR(parse_github_url(review_url));

    // cannot review own PR
    if (review.created_by === username) {
      throw new Error(`Cannot use PR ${review.url} opened by user for review requirement.`);
    }

    // comments made by user within the date range
    const eligible_comments = FilterComments(review.comments, username, start, end);

    // placeholder logic: valid if at least 10 words total
    const total_word_count = eligible_comments.reduce(
      (count, comment) => count + comment.content.split(' ').length,
      0
    );
    if (total_word_count < 10) {
      throw new Error('Trivial review.');
    }
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

/** Retrieves information about opened PR `pull_request`. */
const GetOpenedPR = async (pull_request: PullRequest): Promise<OpenedPR> => {
  const octokit = new Octokit();

  return octokit.rest.pulls.get(pull_request).then((res) => {
    // handle non 200 response?

    const pr = res.data;
    return {
      url: pr.html_url,
      created_by: pr.user?.login || '',
      created_at: Date.parse(pr.created_at),
      diff_size: pr.additions + pr.deletions
    };
  });
};

/** Determines whether an open PR is valid. */
const ValidateOpen = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission,
  open_url: string
): Promise<ValidationResult> => {
  const start = portfolio.earliestValidDate;
  const end = portfolio.deadline;
  const username = submission.member.github || ''; // must be github username

  try {
    // get open object
    const open = await GetOpenedPR(parse_github_url(open_url));

    if (open.created_by !== username) {
      throw new Error(`User ${username} did not open the pull request ${open.url}.`);
    }

    if (start >= open.created_at && open.created_at >= end) {
      const start_date = new Date(start).toDateString();
      const end_date = new Date(end).toDateString();
      throw new Error(
        `Pull request ${open.url} was not made between ${start_date} and ${end_date}.`
      );
    }

    // placeholder logic: valid if at least 10 changes total
    if (open.diff_size < 10) {
      throw new Error('Trivial PR.');
    }
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

/** ="at least one of `results` is valid" */
const atLeastOneValid = (results: ValidationResult[]) =>
  results.reduce((isValid, result) => isValid || result.status === 'valid', false);

/** Determines whether submission is valid or invalid. */
const ValidateSubmission = async (
  portfolio: DevPortfolio,
  submission: DevPortfolioSubmission
): Promise<DevPortfolioSubmission> => {
  const reviewResults = await Promise.all(
    submission.reviewedPRs.map(async (url) => ValidateReview(portfolio, submission, url))
  );

  const openedResults = await Promise.all(
    submission.openedPRs.map(async (url) => ValidateOpen(portfolio, submission, url))
  );

  const status =
    atLeastOneValid(reviewResults) && atLeastOneValid(openedResults) ? 'valid' : 'invalid';
  return { ...submission, status };
};

export default ValidateSubmission;
