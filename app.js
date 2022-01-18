const { handleInvalidEndpoint } = require("./errorHandlers");
const { getTopics } = require("./controllers/topics.controller");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", handleInvalidEndpoint);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
