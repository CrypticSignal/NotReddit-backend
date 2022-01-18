const { retrieveTopics } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  let topics;
  try {
    topics = await retrieveTopics();
  } catch (err) {
    next(err);
    return;
  }
  res.status(200).send(topics);
};
