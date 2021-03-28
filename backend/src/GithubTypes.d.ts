import { Endpoints } from '@octokit/types';

export type PRResponse = Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][0];
