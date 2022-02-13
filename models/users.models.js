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

exports.addUser = async (userData) => {
  const query = `
  INSERT INTO users(name, username, avatar_url)
  VALUES ('${userData.name}', '${userData.username}', '${userData.avatar_url}') RETURNING *;
  `;
  const queryResult = await db.query(query);
  return {
    addedUser: queryResult.rows[0],
  };
};
