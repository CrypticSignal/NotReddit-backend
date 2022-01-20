const { retrieveTopics } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await retrieveTopics();
    res.status(200).send(topics);
  } catch (err) {
    next(err);
    return;
  }
};
