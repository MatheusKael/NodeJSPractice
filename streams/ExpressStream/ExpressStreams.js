const stream = require("stream");
const util = require("util");
const express = require("express");

const app = express();

class StatStream extends stream.Readable {
  constructor(limit) {
    super();
    this.limit = limit;
  }

  _read(size) {
    if (this.limit === 0) {
      this.push(null);
    } else {
      this.push(util.inspect(process.memoryUsage()));

      this.push("n");
      this.limit--;
    }
  }
}

app.get("/", (req, res) => {
  const statStream = new StatStream(1);

  statStream.pipe(res);
});

app.listen(3000);
