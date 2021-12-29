const stream = require("stream");
const util = require("util");

class MemoryStream extends stream.Readable {
  options;

  constructor(options) {
    super();
    this.options = options || {};
    this.options.objectMode = true;
    stream.Readable.call(this, this.options);
  }

  _read(size) {
    this.push(process.memoryUsage());
  }
}

const memoryStream = new MemoryStream();

memoryStream.on("readable", () => {
  const output = memoryStream.read();

  console.log("Type: %s, value: %j", typeof output, output);
});
