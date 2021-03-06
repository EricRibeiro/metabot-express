"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@octokit/rest");
const auth_app_1 = require("@octokit/auth-app");
const metabot_utils_1 = require("metabot-utils");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.query.owner;
    const repo = req.query.repo;
    const issue_number = parseInt(req.query.issueNumber);
    const label = req.query.label;
    const installationId = req.query.installationId;
    const appOctokit = new rest_1.Octokit({
        authStrategy: auth_app_1.createAppAuth,
        auth: {
            appId: parseInt(process.env.APP_ID),
            privateKey: process.env.PRIVATE_KEY,
            installationId
        }
    });
    const mongo = new metabot_utils_1.Mongo(process.env.MONGO_CONN_STRING);
    const { documents, error } = yield mongo.findAll("metabot", "comments", Object.assign({ owner,
        repo,
        issue_number }, (label !== "all" && { label })));
    if (error)
        throw error;
    const comments = documents.map((curr) => { return curr.comment.body; })
        .join("\n");
    yield appOctokit.issues.createComment({
        owner,
        repo,
        issue_number,
        body: `Here are the comments with the label **${label}**:\n${comments}`
    });
    res.redirect(`https://github.com/${owner}/${repo}/pull/${issue_number}`);
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
