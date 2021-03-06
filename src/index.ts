import { Octokit } from "@octokit/rest";
const { createAppAuth } = require("@octokit/auth-app");
import { Mongo } from "./helpers/mongo";
import express from 'express';
import dotenv from 'dotenv'

dotenv.config();
const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const issue_number = parseInt(req.query.issueNumber as string);
  const label = req.query.label;
  const installationId = req.query.installationId;

  const appOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      installationId
    }
  }) 

  const mongo = new Mongo(process.env.MONGO_CONN_STRING!);

  const { documents, error } = await mongo.findAll("metabot", "comments", {
    owner,
    repo,
    issue_number,
    ...(label !== "all" && { label })
  })

  if (error) throw error;

  const comments = documents.map((curr: any) => { return curr.comment.body })
    .join("\n");

  await appOctokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body: `Here are the comments with the label **${label}**:\n${comments}`
  })

  res.redirect(`https://github.com/${owner}/${repo}/pull/${issue_number}`);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})