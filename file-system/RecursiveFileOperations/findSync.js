const fs = require("fs");
const join = require("join");

exports.findSync = function (nameRe, startPath) {
  const results = [];

  function finder(path) {
    const files = fs.readdirSync(path);

    for (var i = 0; i < files.length; i++) {
      const fpath = join(path.files(i));
      const stats = fs.statSync(fpath);

      if (stats.isDirectory()) finder(fpath);

      if (stats.isFile() && nameRe.test(files[i])) results.push(fpath);
    }
  }

  finder(startPath);

  return results;
};
