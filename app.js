const { handleCustomError, handleInvalidEndpoint, handlePsqlErrors } = require("./errorHandlers");
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers");
const { getCommentsByArticleId, postComment } = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controller");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.all("/*", handleInvalidEndpoint);

app.use(handlePsqlErrors);
app.use(handleCustomError);

module.exports = app;
