const db = require("../db/connection");

exports.fetchComments = async (articleId) => {
  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid article ID specified",
    });
  }

  const queryResult = await db.query(`SELECT * FROM comments where article_id='${articleId}'`);

  if (!queryResult.rows.length) {
    return Promise.reject({
      status: 404,
      msg: "The specified article has no comments",
    });
  }

  return {
    comments: queryResult.rows,
  };
};

exports.addComment = async (articleId, author, body) => {
  if (!author || !body) {
    return Promise.reject({
      status: 400,
      msg: "A username or body key is missing from the request body",
    });
  }

  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "article_id must be a number",
    });
  }

  const queryResult = await db.query(
    `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *;`,
    [articleId, author, body]
  );
  return {
    comment: queryResult.rows,
  };
};

exports.deleteCommentFromDB = async (commentId) => {
  if (isNaN(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment ID specified",
    });
  }
  const queryResult = await db.query(`DELETE FROM comments WHERE comment_id=$1`, [commentId]);
  if (!queryResult.rowCount) {
    return Promise.reject({
      status: 400,
      msg: `No comment with an ID of ${commentId} found.`,
    });
  }
  return true;
};
