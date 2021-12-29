"use-strict";

const stream = require("stream");
const util = require("util");
const fs = require("fs");

class JSONlineReader extends stream.Readable {
  constructor(source) {
    super();
    this._source = source;
    this._foundLineEnd = false;
    this._buffer = "";
    source.on(
      "readable",
      function () {
        this.read();
      }.bind(this)
    );
  }

  _read(size) {
    var chunk;
    var line;
    var lineIndex;
    var result;

    if (this._buffer.length === 0) {
      chunk = this._source.read();
      this._buffer += chunk;
    }

    lineIndex = this._buffer.indexOf("n");

    if (lineIndex !== -1) {
      line = this._buffer.slice(0, lineIndex);
      if (line) {
        result = JSON.parse(line);
        this._buffer = this._buffer.slice(lineIndex + 1);
        this.emit("object", result);
        this.push(util.inspect(result));
      } else {
        this._buffer = this._buffer.slice(1);
      }
    }
  }
}

const input = fs.createReadStream(__dirname + "/json-lines.txt", {
  enconding: "utf8",
});

const jsonLineReader = new JSONlineReader(input);

jsonLineReader.on("object", (obj) => {
  console.log("pos:", obj.pos, "- letter", obj.letter);
});
