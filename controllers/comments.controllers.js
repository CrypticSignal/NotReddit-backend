const {
  deleteCommentFromDB,
  fetchComments,
  addComment,
  updateCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const comments = await fetchComments(req.params.article_id);
    res.status(200).send(comments);
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

exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.comment_id;
  try {
    if (await deleteCommentFromDB(commentId)) {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

exports.patchCommentById = async (req, res, next) => {
  try {
    const updatedComment = await updateCommentById(req.params.comment_id, req.body);
    res.status(200).send(updatedComment);
  } catch (err) {
    next(err);
  }
};
