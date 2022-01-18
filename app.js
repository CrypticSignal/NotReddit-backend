const { handleInvalidEndpoint } = require("./errorHandlers");
const { getTopics } = require("./controllers/topics.controller");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", handleInvalidEndpoint);

module.exports = app;
