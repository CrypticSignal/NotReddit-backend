const req = require("express/lib/request");
const { query } = require("../db/connection");
const db = require("../db/connection");

const validSortMethods = [
  "article_id",
  "title",
  "body",
  "votes",
  "topic",
  "author",
  "created_at",
  "comment_count",
];

const validSortOrders = ["ASC", "DESC"];

const getNumComments = async (articleId) => {
  const comments = await db.query(`SELECT * FROM comments WHERE article_id=$1`, [articleId]);
  return comments.rows.length;
};

exports.fetchArticles = async (sortBy, sortOrder, topic) => {
  if (!validSortMethods.includes(sortBy) || !validSortOrders.includes(sortOrder.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort_by or order query received",
    });
  }

  let query = `SELECT * FROM articles ORDER BY ${sortBy} ${sortOrder}`;

  if (topic) {
    query = `SELECT * FROM articles WHERE topic='${topic}' ORDER BY ${sortBy} ${sortOrder}`;
  }

  const queryResult = await db.query(query);

  if (!queryResult.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "No entries found",
    });
  }

  for (const article of queryResult.rows) {
    const numComments = await getNumComments(article.article_id);
    article["comment_count"] = numComments;
  }

  return {
    articles: queryResult.rows,
  };
};

exports.fetchArticleById = async (id) => {
  const queryResult = await db.query(`SELECT * FROM articles WHERE article_id=$1;`, [id]);

  // If the article_id does not exist
  if (queryResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found with an ID of ${id}`,
    });
  }

  const numComments = await getNumComments(id);
  queryResult.rows[0]["comment_count"] = numComments;

  return {
    article: queryResult.rows,
  };
};

exports.updateArticleById = async (id, requestBody) => {
  const queryResult = await db.query(
    `
		UPDATE articles
    SET votes = votes + $1
		WHERE article_id = $2
		RETURNING *;`,
    [requestBody.inc_votes, id]
  );

  // If the article_id does not exist
  if (queryResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found with an ID of ${id}`,
    });
  }

  return {
    article: queryResult.rows,
  };
};
