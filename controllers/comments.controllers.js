const { fetchComments, addComment } = require("../models/comments.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const article = await fetchComments(req.params.article_id);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const postedComment = await addComment(req.params.article_id, req.body.username, req.body.body);
    res.status(201).send(postedComment);
  } catch (err) {
    next(err);
  }
};
