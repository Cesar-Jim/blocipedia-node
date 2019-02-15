const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : satic", () => {

  describe("GET /", () => { // Set the title for the test suite to match the HTTP verb (GET) and route (URI) it will test.
    it("should return status code 200 and have 'Welcome to Blocipedia' in the body of the response", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Welcome to Blocipedia");
        done();
      });
    });
  }); // End of "GET /" test
}); // End of suite routes : static