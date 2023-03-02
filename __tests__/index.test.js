import supertest from "supertest";
import sequelize from "sequelize";
import dotenv from "dotenv";
import UserModel from "../src/api/models/UserModel";
import server from "../src/server";
dotenv.config();
const client = supertest(server);
import request from "supertest";

describe("User router", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // reset the database before running the tests
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const userData = { displayName: "Alice", password: "123456", email: "alice@example.com" };
      const res = await request(app).post("/users").send(userData);
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual("Added a new user.");
      expect(res.body.userId).not.toBeNull();
    });

    it("should return a 400 error if fields are missing or contain curse words", async () => {
      const userData = { displayName: "", password: "", email: "not an email" };
      const res = await request(app).post("/users").send(userData);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Fields are required and can't include curse words.");
    });
  });

  describe("GET /users/:userId", () => {
    it("should return a user by id", async () => {
      const userData = { displayName: "Bob", password: "123456", email: "bob@example.com" };
      const user = await UserModel.create(userData);
      const res = await request(app).get(`/users/${user.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(user.id);
    });

    it("should return a 404 error if the user does not exist", async () => {
      const res = await request(app).get("/users/1234");
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("User Not Found");
    });
  });

  describe("PUT /users/:userId", () => {
    it("should update a user by id", async () => {
      const userData = { displayName: "Charlie", password: "123456", email: "charlie@example.com" };
      const user = await UserModel.create(userData);
      const updatedUserData = { displayName: "Charlie Brown" };
      const res = await request(app).put(`/users/${user.id}`).send(updatedUserData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.displayName).toEqual(updatedUserData.displayName);
    });

    it("should return a 404 error if the user does not exist", async () => {
      const updatedUserData = { displayName: "Delta" };
      const res = await request(app).put("/users/1234").send(updatedUserData);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("User Not Found");
    });
  });

  it("should delete a user by id", async () => {
    const res = await client.delete(`/users/${user.id}`);
    expect(res.statusCode).toEqual(204);
    expect(res.body).toEqual({});
    const deletedUser = await UserModel.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });
  
  it("should return a 404 error if the user does not exist", async () => {
    const res = await client.delete("/users/1234");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("User not found.");
  });
  });

  
  
  
  