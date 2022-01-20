const db = require("../connection");
const format = require("pg-format");

const createTopicsTableQuery = `CREATE TABLE topics (
  slug VARCHAR(255) PRIMARY KEY,
  description VARCHAR(255) NOT NULL
);`;
const createUserTableQuery = `CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  avatar_url VARCHAR(2048), 
  name VARCHAR(255) NOT NULL
)`;
const createArticlesTableQuery = `CREATE TABLE articles (
  article_id SMALLSERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  votes SMALLINT DEFAULT 0,
  topic VARCHAR(255) REFERENCES topics(slug),
  author VARCHAR(50) REFERENCES users(username),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
const createCommentsTableQuery = `CREATE TABLE comments (
  comment_id SMALLSERIAL PRIMARY KEY,
  author VARCHAR(50) REFERENCES users(username),
  article_id SMALLINT REFERENCES articles(article_id),
  votes SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  body TEXT NOT NULL
)`;

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;

  const tableNames = ["topics", "articles", "users", "comments"];

  for (const tableName of tableNames) {
    await db.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
  }

  await db.query(createTopicsTableQuery);
  await db.query(createUserTableQuery);
  await db.query(createArticlesTableQuery);
  await db.query(createCommentsTableQuery);

  const topicDataArray = topicData.map((data) => [data.slug, data.description]);
  const topicSeed = format(
    `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
    topicDataArray
  );

  const userDataArray = userData.map((data) => [data.username, data.name, data.avatar_url]);
  const userSeed = format(
    `INSERT into users (username, name, avatar_url) VALUES %L RETURNING *;`,
    userDataArray
  );

  const articleDataArray = articleData.map((data) => [
    data.title,
    data.topic,
    data.author,
    data.body,
    data.created_at,
    data.votes,
  ]);
  const articleSeed = format(
    `INSERT into articles (title, topic, author, body, created_at, votes) VALUES %L RETURNING *;`,
    articleDataArray
  );

  const commentDataArray = commentData.map((data) => [
    data.body,
    data.votes,
    data.author,
    data.article_id,
    data.created_at,
  ]);
  const commentSeed = format(
    `INSERT into comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *;`,
    commentDataArray
  );

  await db.query(topicSeed);
  await db.query(userSeed);
  await db.query(articleSeed);
  await db.query(commentSeed);
};

module.exports = seed;
