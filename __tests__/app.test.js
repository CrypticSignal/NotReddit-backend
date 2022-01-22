const app = require("../app");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Request made to an invalid endpoint", () => {
  it("Responds with a status of 404 and a message of 'Invalid endpoint'", async () => {
    const { status, body } = await request(app).get("/invalid-endpoint");
    expect(status).toBe(404);
    expect(body).toEqual({ msg: "Invalid endpoint" });
  });
});

describe("GET /api/topics", () => {
  it("Responds with a status of 200", async () => {
    const { status } = await request(app).get("/api/topics");
    expect(status).toBe(200);
  });
  it("Returns an object containing an array of topics in the correct format.", async () => {
    const { body } = await request(app).get("/api/topics");
    expect(body).toBeInstanceOf(Object);
    expect(body.topics).toBeInstanceOf(Array);
    expect(body.topics[0]).toBeInstanceOf(Object);

    body.topics.forEach((topic) => {
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
    const { status } = await request(app).get("/api/articles/2");
    expect(status).toBe(200);
  });
  it("Returns an object containing the article in the correct format.", async () => {
    const { body } = await request(app).get("/api/articles/2");
    expect(body).toBeInstanceOf(Object);
    expect(body.article).toBeInstanceOf(Object);
    expect(body.article).toEqual(
      expect.objectContaining({
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars",
        created_at: "2020-10-16T05:03:00.000Z",
        comment_count: 0,
      })
    );
  });
  it("Returns a status of 404 if the article_id does not exist", async () => {
    const nonExistentID = 9999;
    const { status, body } = await request(app).get(`/api/articles/${nonExistentID}`);
    expect(status).toBe(404);
    expect(body.msg).toBe(`No article found with an ID of ${nonExistentID}`);
  });
  it("Returns a status of 400 if an invalid ID is supplied", async () => {
    const { status, body } = await request(app).get("/api/articles/meow");
    expect(status).toBe(400);
    expect(body.msg).toBe("Bad request");
  });
});

describe("PATCH /api/article/:article_id", () => {
  it("Responds with a status of 200 and the updated article", async () => {
    const requestBody = { inc_votes: -10 };
    const { status, body } = await request(app).patch("/api/articles/1").send(requestBody);
    expect(status).toBe(200);
    expect(body.article).toEqual(
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
  it("Responds with a 400 status and an error message if no body is sent with the request", async () => {
    const { status, body } = await request(app).patch("/api/articles/1");
    expect(status).toBe(400);
    expect(body.msg).toBe("Request body is empty");
  });
  it("Responds with a 400 status and an error message if the request body contains the wrong key", async () => {
    const requestBody = { inc_botes: 10 };
    const { status, body } = await request(app).patch("/api/articles/1").send(requestBody);
    expect(status).toBe(400);
    expect(body.msg).toBe("Request body must contain an inc_votes key");
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
    const { status } = await request(app).get("/api/articles/1/comments");
    expect(status).toBe(200);
  });
  it("Returns the comments in the correct format, if the article has comments", async () => {
    const { body } = await request(app).get("/api/articles/1/comments");
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
  it("Returns a status of 400 and the correct msg if a user not in the DB tries to post a comment", async () => {
    const testBody = {
      username: "unregisted_user",
      body: "This is my comment",
    };
    const { status, body } = await request(app).post("/api/articles/1/comments").send(testBody);
    expect(status).toBe(400);
    expect(body.msg).toBe("Username does not exist");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("Returns a status of 204 when given a valid comment_id", async () => {
    const { status, body } = await request(app).delete("/api/comments/1");
    expect(status).toBe(204);
    expect(body).toEqual({});
  });
  it("Returns a status of 400 and the correct msg if the comment ID does not exist", async () => {
    const nonExistentID = 9999;
    const { status, body } = await request(app).delete(`/api/comments/${nonExistentID}`);
    expect(status).toBe(400);
    expect(body.msg).toBe(`No comment with an ID of ${nonExistentID} found.`);
  });
  it("Returns a status of 400 and the correct msg if something other than a number is specified at the end of the path", async () => {
    const { status, body } = await request(app).delete("/api/comments/a");
    expect(status).toBe(400);
    expect(body.msg).toBe("Invalid comment ID specified");
  });
});

describe("GET /api", () => {
  it("Returns a status of 200 and an object describing the available endpoints, containing at least the following keys: description, queries, successStatusCode", async () => {
    const { status, body } = await request(app).get("/api");
    const responseObject = JSON.parse(body);

    const endpointObjects = [];

    for (const object in responseObject) {
      endpointObjects.push(responseObject[object]);
    }
    expect(status).toBe(200);
    expect(responseObject).toBeInstanceOf(Object);

    endpointObjects.forEach((endpointObject) => {
      expect(endpointObject).toEqual(
        expect.objectContaining({
          description: expect.any(String),
          queries: expect.any(Array),
          successStatusCode: expect.any(Number),
        })
      );
    });
  });
});
