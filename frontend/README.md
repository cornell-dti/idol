# IDOL Frontend

![idol screenshot](../screenshots/idol-screenshot.png)

The website is built with React and TypeScript. It is deployed to a netlify instance together with
idol backend, but separate from DTI website.

## Local testing

When running the frontend locally, the frontend must be configured to be using the same Firebase instance as the backend for Google authentication. If the backend is connected to the production Firebase instance, set `useProdDb` to `true` in `src/environment.ts`. If the backend is connected to the development Firebase instance set `useProdDb` to `false` in `src/environment.ts`.

<b>Make sure that `useProdDb` is `true` before committing.</b>
