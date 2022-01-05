const fs = require("fs");
const zlib = require("zlib");

function benchStream(inSize, outSize) {
  // hrtime is used to get precise nanoseconds measurements of the current time
  const time = process.hrtime();
  const watermark = process.memoryUsage();

  const input = fs.createReadStream("/usr/share/dict/words", {
    bufferSize: inSize,
  });

  const gzip = zlib.createGzip({ chunkSize: outSize });
  const output = fs.createWriteStream("out.gz", { bufferSize: inSize });

  const memoryCheck = setInterval(function () {
    const rss = process.memoryUsage().rss;

    if (rss > watermark) {
      watermark = rss;
    }
  }, 50);

  input.on("end", () => {
    const memoryEnd = process.memoryUsage();
    clearInterval(memoryCheck);

    const diff = process.hrtime();

    console.log(
      [
        inSize,
        outSize,
        (diff[0] * 1e9 + diff[1]) / 1000000,
        watermark / 1024,
      ].join(", ")
    );
  });
  input.pipe(gzip).pipe(output);

  return input;
}

console.log("file size, gzip size, ms , RSS");

var fileSize = 128;
var zipSize = 5024;

function run(times) {
  benchStream(fileSize, zipSize).on("end", () => {
    times--;
    fileSize += 2;
    zipSize += 2;
    if (times > 0) {
      run(times);
    }
  });
}

run(10);
