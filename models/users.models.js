const db = require("../db/connection");

exports.fetchUsernames = async () => {
  const queryResult = await db.query("SELECT username FROM users");
  return {
    usernames: queryResult.rows,
  };
};

exports.fetchUser = async (username) => {
  const queryResult = await db.query("SELECT * FROM users WHERE username=$1", [username]);
  return {
    user: queryResult.rows[0],
  };
};
