const {
  addArticle,
  deleteArticleById,
  fetchArticles,
  updateArticleById,
  fetchArticleById,
} = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  const sortBy = req.query.sort_by ? req.query.sort_by : "created_at";
  const sortOrder = req.query.order ? req.query.order : "DESC";
  const topic = req.query.topic ? req.query.topic : false;
  try {
    const articlesObject = await fetchArticles(sortBy, sortOrder, topic);
    res.status(200).send(articlesObject);
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const article = await fetchArticleById(req.params.article_id, req.body);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const updatedArticle = await updateArticleById(req.params.article_id, req.body);
    res.status(200).send(updatedArticle);
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const addedArticle = await addArticle(req.body);
    res.status(201).send(addedArticle);
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    await deleteArticleById(req.params.article_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
