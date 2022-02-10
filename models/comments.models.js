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

exports.updateCommentById = async (id, requestBody) => {
  if (Object.keys(requestBody).length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Request body is empty",
    });
  }

  if (Object.keys(requestBody)[0] !== "inc_votes") {
    return Promise.reject({
      status: 400,
      msg: "Request body must contain an inc_votes key",
    });
  }

  const queryResult = await db.query(
    `
		UPDATE comments
    SET votes = votes + $1
		WHERE comment_id = $2
		RETURNING *;`,
    [requestBody.inc_votes, id]
  );

  // If the article_id does not exist
  if (queryResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No comment found with an ID of ${id}`,
    });
  }

  return {
    comment: queryResult.rows[0],
  };
};
