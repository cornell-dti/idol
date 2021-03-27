export type PRResponse = {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: unknown | null;
  body: string | null;
  labels: {
    id?: number;
    node_id?: string;
    url?: string;
    name?: string;
    description?: string;
    color?: string;
    default?: boolean;
  }[];
  milestone: unknown | null;
  active_lock_reason?: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  /** Indicates whether or not the pull request is a draft. */
  draft?: boolean;
};
