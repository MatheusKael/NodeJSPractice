const cp = require("child_process");

// spawn-detached -> The child process is no longer dependent on the parent process.
// The parend process can exit without the child process being killed.

const child = cp.spawn("./longrun", [], { detached: true });
