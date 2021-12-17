const http = require("http");
const CountStream = require("./writableStream");
const countStream = new CountStream("browse");

http.get("http://www.manning.com", (res) => {
  res.pipe(countStream);
});

countStream.on("total", (total) => {
  console.log(`Total: ${total}`);
});
