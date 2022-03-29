const cp = require("child_process");

cp.execFile("echo", ["hello", "world"], (err, stdout, stderr) => {
  if (err) console.error(err);

  console.log("stout", stdout);
  console.log("stderr", stderr);
});
