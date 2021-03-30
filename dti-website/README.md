# DTI Website

![nova screenshot](../screenshots/nova-screenshot.png)

The website is built with React and TypeScript. It is deployed to a separate instance on Netlify.

[Next.js](https://nextjs.org/) is used to help us generate a completely static website with HTML
generated from React code. This setup ensures that our website has good SEO.

We also have a script [`pull-from-idol.ts`](./pull-from-idol.ts) that is triggered by a GitHub
action [cron job](../.github/workflows/pull-from-idol.yml) periodically to fetch latest member json
from idol backend. It then triggers a pull request if anything changes. After the pull request is
merged, the website with new member information will be redeployed.
