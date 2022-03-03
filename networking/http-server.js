const assert = require("assert");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello World!");
  res.end();
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

const req = http.request({ port: 8000 }, (res) => {
  console.log("HTTP headers:", res.headers);
  res.on("data", (data) => {
    console.log("Body", data.toString());
    assert.equal("Hello World!", data.toString());
    assert.equal(200, res.statusCode);
    server.unref();
  });
});

req.end();
