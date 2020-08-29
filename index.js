const { getOctokit, context } = require('@actions/github');
const core = require('@actions/core');

async function run() {
  const token = core.getInput('github-token', { required: true });
  const sha = core.getInput('sha');
  const octokit = getOctokit(token)

  const result = await octokit.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: sha || context.sha,
  });
  const pr = result.data.length > 0 && result.data[0];

  const { data: pullRequest } = await octokit.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pr.number
  });

  const labels = pullRequest.labels.map(label => label.name);
  core.setOutput('labels', labels);
  core.setOutput('number', pr.number);
  core.setOutput('title', pr.title);
  core.setOutput('body', pr.body);
}

run();