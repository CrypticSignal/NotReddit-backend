const app = require("../app");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Request made to an invalid endpoint", () => {
  it("Respond with a status of 404 and a message of 'Invalid endpoint", async () => {
    const response = await request(app).get("/invalid-endpoint");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ msg: "Invalid endpoint" });
  });
});

describe("/api/topics", () => {
  it("Responds with a status of 200", async () => {
    const response = await request(app).get("/api/topics");
    expect(response.status).toBe(200);
  });
  it("Returns an object containing an array of topics in the correct format.", async () => {
    const response = await request(app).get("/api/topics");
    const topicsObject = response.body;
    expect(topicsObject).toBeInstanceOf(Object);
    expect(topicsObject.topics).toBeInstanceOf(Array);
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
