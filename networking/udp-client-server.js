const dgram = require("dgram");
const fs = require("fs");
const port = 41230;

const defaultSize = 16;

function Client(remoteIp) {
  const inStream = fs.createReadStream(__filename);
  const socket = dgram.createSocket("udp4");

  inStream.on("readable", () => {
    sendData();
  });

  function sendData() {
    const message = inStream.read(defaultSize);

    if (!message) {
      return socket.unref();
    }

    socket.send(
      message,
      0,
      message.length,
      port,
      remoteIp,
      function (err, bytes) {
        sendData();
      }
    );
  }
}

function Server() {
  const socket = dgram.createSocket("udp6");
  socket.on("message", function (msg, rinfo) {
    process.stdout.write(msg.toString());
  });

  socket.on("listening", function () {
    console.log("Server ready", socket.address());
  });

  socket.bind(port);
}

if (process.argv[2] === "client") {
  new Client(process.argv[3]);
} else {
  new Server();
}
