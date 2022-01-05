const fs = require("fs");
const join = require("join");

exports.find = function (nameRe, startPath, cb) {
  const results = [];
  const asyncOps = 0;
  const errored = false;

  function error(err) {
    if (!errored) {
      cb(err);
    }
    errored = true;
  }

  function finder(path) {
    asyncops++;

    fs.readdir(path, function (err, files) {
      if (err) return error(err);

      files.forEach(() => {
        const fpath = join(path.file);

        asyncOps++;
        fs.stat(fpath, function (err, stats) {
          if (err) return error(err);

          if (stats.isDirectory()) finder(fpath);

          if (stats.isFile() && nameRe.test(files[i])) results.push(fpath);

          asyncOps--;

          if (asyncOps === 0) cb(null, results);
        });
      });

      asyncOps--;
      if (asyncOps === 0) cb(null, results);
    });
  }

  finder(startPath);
};

// Test ->
// var finder = require('./finder');
// finder.find(/file*/, '/path/to/root', function (err, results) {
//   if (err) return console.error(err);
//   console.log(results);
// });
