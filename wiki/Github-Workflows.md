# Github Workflows

To ensure quality, this repo is equipped with a variety of workflows.
Because this repository combines the frontend, as well as the backend, there are testing and linting workflows, which will be the same for both subdirectories.

## Testing

These workflows will run a matrix test on the node versions 12.x and 14.x, as well as the latests versions of macOS, Windows and Ubuntu.
The workflows will checkout the repository, and run `npm ci`, as well as `npm test` in the client/server directory.

Files:

- frontendTesting.yml (Frontend testing)
- backendTesting.yml (Backend testing)

Runs on:

- pushes to the `DEV` branch
- PRs to the `DEV` branch
- on workflow dispatch event (manual trigger)

## Linting

The workflows will checkout the repository, initialize node on version 14, and run `npm ci`, as well as `npm run lint` in the client/server directory.

Files:

- linterFrontend.yml (Lint Frontend Code Base)
- linterServer.yml (Lint Server Code Base)

Runs on:

- all pushes except to the `main` branch
- all PRs except to the `main` branch

## Code Documentation

The workflows will checkout the repository, navigate to the client directory, which contains the required command for documentation generation and will generate this by calling `cd ./client/ && npm install --save-dev better-docs jsdoc && npm run docs`.
The resulting directory of `/documentationWebsite` will be deployed to Github Pages by an external Github action.

Files:

- publishDocumentation.yml (Publish Documentation to GitHub pages)

Runs on:

- pushes to the `main` branch

## Repository Wiki Sync

The workflows will checkout the repository, and will use an external Github Action to deploy the `/wiki` directory to the repositories wiki. For this fictional data (username: Wiki Warden) is used for the commit.

Files:

- wikiPageSync.yml (Wiki Update)

Runs on:

- pushes to the `DEV` branch

## Code Deployment

The workflows will checkout the repository and navigate to the `client` directory. There it will build the frontend, which results in a directory called `build`, which will then be moved to the top-level of the repository. Additionally the `client` directory is deleted and all content from the `server` directory is moved to the toplevel of the repository.
From there on an external Github Action is used to authenticate to the Heroku CLI with the `HEROKU_API_KEY` and `HEROKU_EMAIL` secrets set in the repository secrets. The Heroku application name is set to `ark-automate` by default in the workflow.
Finally, the deployment is being completed by commiting the changes and pushing to the heroku remote.

Files:

- herokuDeploy.yml (Heroku Deployment)

Runs on:

- pushes to the `main` branch
- on workflow dispatch event (manual trigger)
