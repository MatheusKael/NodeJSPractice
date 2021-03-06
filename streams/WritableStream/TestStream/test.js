const assert = require("assert");
const CountStream = require("./writableStream");
const countStream = new CountStream("example");
const fs = require("fs");
let passed = 0;

countStream.on("total", (count) => {
  assert.equal(count, 1);

  passed++;
});

fs.createReadStream(__filename).pipe(countStream);

process.on("exit", () => {
  console.log("Assertion passed:", passed);
});
