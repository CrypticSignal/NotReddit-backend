const db = require("../db/connection");

exports.retrieveTopics = async () => {
  const response = await db.query(`SELECT * FROM topics;`);
  return {
    topics: response.rows,
  };
};
