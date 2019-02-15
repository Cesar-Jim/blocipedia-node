// This file functions as the Node server

const app = require("./app");
const http = require("http");

// Normalize the port to select it either assigned by the environment (Heroku) or port 3000 (localhost)
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Server creation:
const server = http.createServer(app);

server.listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

server.on("listening", () => {
  console.log(`server is listening for requests on port ${server.address().port}`);
});