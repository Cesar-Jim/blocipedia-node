const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : satic", () => {

  describe("GET /", () => { // Set the title for the test suite to match the HTTP verb (GET) and route (URI) it will test.
    it("should return status code 200", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  }); // End of "GET /" test
}); // End of suite routes : static