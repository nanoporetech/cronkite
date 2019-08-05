# Deploying Cronkite in DEV

> NB. This is a temporary measure while a CI user/group does NOT exist for syncing builds to S3

## Steps/Changes required

### 1. Build Cronkite

- If you haven't already cloned the Cronkite repository, do it
- `cd <cronkite folder>`
- `npm i`
- `npm run build`

### 2. AWS S3

- Sync the contents of the build directory to AWS S3
- **The command below will overwrite any existing content beneath the AWS prefix**
- Report ID `1` was arbitrarily selected to host the Cronkite build.

`aws --profile <DEV API profile name> s3 sync --delete ./build/ s3://metrichor-dev-reports/uncompressed/1/`

### 3. Modify the Portal MySQL database

- Change the name of the report to something recognizable - not required but helpful

`update report set name='Cronkite test' where id_report = 1;`

### 4. Attach Cronkite report to a workflow or create a new workflow to test with

See https://epi2me-dev.nanoporetech.com/workflow/1733
