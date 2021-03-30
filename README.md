# IDOL

![Build Status](https://github.com/cornell-dti/idol/workflows/Build/badge.svg)

## About

```text
IDOL = Internal DTI Organization Logic
```

![idol screenshot](./screenshots/idol-screenshot.png)
![nova screenshot](./screenshots/nova-screenshot.png)

This repo contains both the source code that powers both IDOL system and DTI website.

## Project installation

You will need [Node.js](https://nodejs.org/en/download/) and
[Yarn](https://classic.yarnpkg.com/en/docs/install) installed on your development machine.

To setup your environment, go into the root folder and run yarn. Then, run
`yarn workspace frontend start` to start a development server for frontend. You also need to run the
local backend server by `yarn workspace backend dev` to make the local frontend fully functional.

This repository comes with multiple tools to ensure code quality, including a linter and a type
checker. Please ensure that they are properly configured with your IDE or text editor. For text
editor setup instructions, please visit Cornell DTI's
[developer website](https://dev.cornelldti.org/docs/onboarding-editor).

## Contributing

To maintain code quality, the master branch is write-protected. To contribute, please work on your
changes in a new branch and then create a pull request into master. When opening a pull request,
make sure you follow the pull request template. Better changelogs make the review process go quicker
and easier for everyone.

## Documentation

- [IDOL Frontend Documentation](./frontend/README.md)
- [IDOL Backend Documentation](./backend/README.md)
- [DTI Website Documentation](./dti-website/README.md)

All the common types used by the packages are defined [here](./common-types/index.d.ts).

## Contributors

### Spring 2021

- **Morgan Belous** - Developer
- **Henry Li** - Developer
- **Riya Jaggi** - Developer
- **Sam Zhou** - Developer
- **Grace Han** - Developer

### Fall 2020

- **Morgan Belous** - Developer
- **Henry Li** - Developer
- **Riya Jaggi** - Developer
- **Jagger Brulato** - Developer

## DTI

We are a team within the **Cornell Design & Tech Initiative**. For more information, see
[our website](https://cornelldti.org/).

[![Cornell DTI](https://raw.githubusercontent.com/cornell-dti/design/master/Branding/Wordmark/Dark%20Text/Transparent/Wordmark-Dark%20Text-Transparent%403x.png)](https://cornelldti.org/)
