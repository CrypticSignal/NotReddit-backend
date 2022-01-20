const app = require("../app");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Request made to an invalid endpoint", () => {
  it("Responds with a status of 404 and a message of 'Invalid endpoint'", async () => {
    const response = await request(app).get("/invalid-endpoint");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ msg: "Invalid endpoint" });
  });
});

describe("GET /api/topics", () => {
  it("Responds with a status of 200", async () => {
    const response = await request(app).get("/api/topics");
    expect(response.status).toBe(200);
  });
  it("Returns an object containing an array of topics in the correct format.", async () => {
    const response = await request(app).get("/api/topics");
    const topicsObject = response.body;
    expect(topicsObject).toBeInstanceOf(Object);
    expect(topicsObject.topics).toBeInstanceOf(Array);
    expect(topicsObject.topics[0]).toBeInstanceOf(Object);

    topicsObject.topics.forEach((topic) => {
      expect(topic).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
});

describe("GET /api/article/:article_id", () => {
  it("Responds with a status of 200 when the article_id exists", async () => {
    const response = await request(app).get("/api/articles/2");
    expect(response.status).toBe(200);
  });
  it("Returns an object containing the article in the correct format.", async () => {
    const response = await request(app).get("/api/articles/2");
    const articleObject = response.body;
    expect(articleObject).toBeInstanceOf(Object);
    expect(articleObject.article).toBeInstanceOf(Array);
    expect(articleObject.article[0]).toBeInstanceOf(Object);
    expect(articleObject.article[0]).toEqual(
      expect.objectContaining({
        article_id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
        votes: expect.any(Number),
        topic: expect.any(String),
        author: expect.any(String),
        created_at: "2020-10-16T05:03:00.000Z",
        comment_count: expect.any(Number),
      })
    );
  });
  it("Returns a status of 404 if the article_id does not exist", async () => {
    const nonExistentID = 9999;
    const response = await request(app).get(`/api/articles/${nonExistentID}`);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(`No article found with an ID of ${nonExistentID}`);
  });
  it("Returns a status of 400 if an invalid ID is supplied", async () => {
    const response = await request(app).get("/api/articles/meow");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad request");
  });
});

describe("PATCH /api/article/:article_id", () => {
  it("Responds with a status of 200 and the updated article", async () => {
    const requestBody = { inc_votes: -10 };
    const { status, body } = await request(app).patch("/api/articles/1").send(requestBody);
    expect(status).toBe(200);
    expect(body.article[0]).toEqual(
      expect.objectContaining({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 90,
      })
    );
  });
  it("Responds with a 400 status and an error message if an invalid ID is specified", async () => {
    const requestBody = { inc_votes: 1 };
    const { status, body } = await request(app).patch(`/api/articles/invalid-id`).send(requestBody);
    expect(status).toBe(400);
    expect(body.msg).toBe("Bad request");
  });
  it("Responds with a 404 status if a valid ID that does not exist is specified", async () => {
    const nonExistentID = 9999;
    const requestBody = { inc_votes: 1 };
    const { status, body } = await request(app)
      .patch(`/api/articles/${nonExistentID}`)
      .send(requestBody);
    expect(status).toBe(404);
    expect(body.msg).toBe(`No article found with an ID of ${nonExistentID}`);
  });
});

describe("GET /api/articles", () => {
  it("Returns a status of 200, sorts the articles by date (descending) by default and returns them in the correct format", async () => {
    const { status, body } = await request(app).get("/api/articles");
    const articles = body.articles;

    expect(articles).toBeSortedBy("created_at", { descending: true });
    expect(status).toBe(200);

    articles.forEach((article) => {
      expect(isNaN(Date.parse(article.created_at))).toBe(false);
      expect(article).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          comment_count: expect.any(Number),
        })
      );
    });
  });
  it("Returns a status of 200 and sorts the articles by the specified query", async () => {
    const { status, body } = await request(app).get("/api/articles?sort_by=title");
    expect(status).toBe(200);
    expect(body.articles).toBeSortedBy("title", { descending: true });
  });
  it("Returns a status of 200 and sorts the articles by the specified query and specified sort order", async () => {
    const { status, body } = await request(app).get("/api/articles?sort_by=title&order=asc");
    expect(status).toBe(200);
    expect(body.articles).toBeSortedBy("title", { descending: false });
  });
  it("Returns a status of 200 and filters by the specified topic", async () => {
    const { status, body } = await request(app).get("/api/articles?topic=mitch");
    const articles = body.articles;
    expect(status).toBe(200);
    articles.forEach((article) => {
      expect(article.topic).toBe("mitch");
    });
  });
  it("Returns a status of 400 if an invalid sort method specified", async () => {
    const { status, body } = await request(app).get("/api/articles?sort_by=pineapple");
    expect(status).toBe(400);
    expect(body.msg).toBe("Invalid sort_by or order query received");
  });
  it("Returns a status of 400 if an invalid sort order is specified", async () => {
    const { status, body } = await request(app).get("/api/articles?sort_by=title&order=banana");
    expect(status).toBe(400);
    expect(body.msg).toBe("Invalid sort_by or order query received");
  });
  it("Returns a status of 404 if querying a topic that does not exist", async () => {
    const { status, body } = await request(app).get("/api/articles?topic=drinks");
    expect(status).toBe(404);
    expect(body.msg).toBe("No entries found");
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  it("Returns a status of 200 if the article ID exists", async () => {
    const { status, body } = await request(app).get("/api/articles/1/comments");
    expect(status).toBe(200);
  });
  it("Returns the comments in the correct format, if the article has comments", async () => {
    const { status, body } = await request(app).get("/api/articles/1/comments");
    body.comments.forEach((commentObject) => {
      expect(isNaN(Date.parse(commentObject.created_at))).toBe(false);
      expect(commentObject).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
        })
      );
    });
  });
  it("Returns a status of 404 and an appropriate msg if the specified article has no comments", async () => {
    const { status, body } = await request(app).get("/api/articles/2/comments");
    expect(status).toBe(404);
    expect(body.msg).toBe("The specified article has no comments");
  });
  it("Returns a status of 400 if an invalid article_id is specified", async () => {
    const { status, body } = await request(app).get("/api/articles/meow/comments");
    expect(status).toBe(400);
    expect(body.msg).toBe("Invalid article ID specified");
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("Responds with a status of 200 and the posted comment in the correct format", async () => {
    const testComment = {
      username: "icellusedkars",
      body: "Test comment.",
    };
    const { status, body } = await request(app).post("/api/articles/1/comments").send(testComment);

    expect(status).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body.comment).toBeInstanceOf(Array);

    const commentObject = body.comment[0];
    expect(commentObject).toBeInstanceOf(Object);
    expect(isNaN(Date.parse(commentObject.created_at))).toBe(false);

    expect(commentObject).toEqual(
      expect.objectContaining({
        comment_id: expect.any(Number),
        article_id: expect.any(Number),
        body: expect.any(String),
        votes: expect.any(Number),
        author: expect.any(String),
      })
    );
  });
  it("Returns a status of 400 and the correct msg if the request body is missing a username or body key", async () => {
    const testBody = {
      username: "mitch",
    };
    const { status, body } = await request(app).post("/api/articles/1/comments").send(testBody);
    expect(status).toBe(400);
    expect(body.msg).toBe("A username or body key is missing from the request body");
  });
  it("Returns a status of 400 and the correct msg if an invalid article ID is specified", async () => {
    const testBody = {
      username: "mitch",
      body: "Test comment",
    };
    const { status, body } = await request(app).post("/api/articles/a/comments").send(testBody);
    expect(status).toBe(400);
    expect(body.msg).toBe("article_id must be a number");
  });
  it.only("Returns a status of 400 and the correct msg if a user not in the DB tries to post a comment", async () => {
    const testBody = {
      username: "unregisted_user",
      body: "This is my comment",
    };
    const { status, body } = await request(app).post("/api/articles/1/comments").send(testBody);
    expect(status).toBe(400);
    expect(body.msg).toBe("Username does not exist");
  });
});
