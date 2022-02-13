const {
  handleCustomError,
  handleInvalidEndpoint,
  handlePsqlErrors,
  handleUnexpectedErrors,
} = require("./errorHandlers");

const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticle,
} = require("./controllers/articles.controllers");

const {
  deleteComment,
  getCommentsByArticleId,
  postComment,
  patchCommentById,
} = require("./controllers/comments.controllers");

const { getTopics } = require("./controllers/topics.controller");
const { getUsernames, getUser, postUser } = require("./controllers/users.controllers");
const { describeEndpoints } = require("./controllers/endpoints.controller");

const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", describeEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsernames);
app.get("/api/users/:username", getUser);

app.post("/api/users", postUser);
app.post("/api/articles", postArticle);
app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/comments/:comment_id", patchCommentById);
app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/articles/:article_id", deleteArticle);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", handleInvalidEndpoint);

app.use(handlePsqlErrors);
app.use(handleCustomError);
app.use(handleUnexpectedErrors);

module.exports = app;
