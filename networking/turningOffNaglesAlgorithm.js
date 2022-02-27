const net = require("net");
const server = net.createServer((c) => {
  c.setNoDelay(true);
  c.write("377375042377373001", "binary");

  console.log("server connected");
  c.on("end", () => {
    console.log("server disconnected");
    server.unref();
  });

  c.on("data", (data) => {
    process.stdout.write(data.toString());
    c.write(data.toString());
  });
});

server.listen(8000, () => {
  console.log("server bound");
});
