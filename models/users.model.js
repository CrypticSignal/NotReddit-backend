const db = require("../db/connection");

exports.fetchUsernames = async () => {
  const queryResult = await db.query("SELECT username FROM users");
  return {
    usernames: queryResult.rows,
  };
};
