const { process_params } = require("express/lib/router");
const stream = require("stream");

HungryStream.prototype = Object.create(stream.Duplex.prototype, {
  constructor: { value: HungryStream },
});

function HungryStream(options) {
  stream.Duplex.call(this, options);
  this.waiting = false;
}

HungryStream.prototype._write = function (chunk, encoding, callback) {
  this.waiting = false;
  this.push("\u001b[32m" + chunk + "\u001b[39m");
  callback();
};

HungryStream.prototype._read = function (size) {
  if (!this.waiting) {
    this.push("Feed me data! > ");
    this.waiting = true;
  }
};

const hungryStream = new HungryStream();

process.stdin.pipe(hungryStream).pipe(process.stdout);
