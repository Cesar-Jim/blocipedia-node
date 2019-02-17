const request = require("request"); // This module makes requests to the server during the tests
const server = require("../../src/server");
const base = "http://localhost:3000/"; // Define the base URL that will be used for the requests

describe("routes : satic", () => {

  describe("GET /", () => { // Set the title for the test suite to match the HTTP verb (GET) and URI for the request
    it("should return status code 200 and have 'Welcome to Blocipedia' in the body of the response", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Blocipedia");
        done();
      });
    });
  }); // End of "GET /" test
}); // End of suite routes : static