const { request } = require("express");
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

exports.fetchArticles = async (sortBy, sortOrder, topic) => {
  if (!validSortMethods.includes(sortBy) || !validSortOrders.includes(sortOrder.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort_by or order query received",
    });
  }

  let query = `
  SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at,
  COUNT(comments)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;

  if (topic) {
    query += ` WHERE topic='${topic}' GROUP BY articles.article_id ORDER BY ${sortBy} ${sortOrder};`;
  } else {
    query += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${sortOrder};`;
  }

  const queryResult = await db.query(query);

  if (!queryResult.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "No entries found",
    });
  }

  return {
    articles: queryResult.rows,
  };
};

exports.fetchArticleById = async (id) => {
  const queryResult = await db.query(
    `SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at,
    COUNT(comments)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [id]
  );

  // If the article_id does not exist
  if (queryResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found with an ID of ${id}`,
    });
  }

  return {
    article: queryResult.rows[0],
  };
};

exports.updateArticleById = async (id, requestBody) => {
  if (Object.keys(requestBody).length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Request body is empty",
    });
  }

  if (Object.keys(requestBody)[0] !== "inc_votes") {
    console.log(Object.keys(requestBody));
    console.log(Object.keys(requestBody)[0]);
    return Promise.reject({
      status: 400,
      msg: "Request body must contain an inc_votes key",
    });
  }

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
    article: queryResult.rows[0],
  };
};
