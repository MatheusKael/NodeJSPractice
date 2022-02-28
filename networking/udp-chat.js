const assert = require("assert");
const dgram = require("dgram");
const fs = require("fs");

const defaultSize = 16;

const port = 41234;

function Client(remoteIP) {
  const socket = dgram.createSocket("udp4");
  const readline = require("readline");
  const rl = readline.createInterface(process.stdin, process.stdout);

  socket.send(new Buffer.from("<JOIN>"), 0, 6, port, remoteIP);

  rl.setPrompt("message> ");
  rl.prompt();

  rl.on("line", function (line) {
    sendData(line);
  }).on("close", () => {
    process.exit(0);
  });

  socket.on("message", (message, rinfo) => {
    console.log("\n<" + rinfo.address + "> " + message.toString());

    rl.prompt();
  });

  function sendData(message) {
    socket.send(
      new Buffer.from(message),
      0,
      message.length,
      port,
      remoteIP,
      (err, bytes) => {
        console.log("Sent:", message);
        rl.prompt();
      }
    );
  }
}

function Server() {
  let clients = [];
  const server = dgram.createSocket("udp4");

  server.on("message", (message, rinfo) => {
    const clientId = rinfo.address + ":" + rinfo.port;

    message = message.toString();

    if (!clients[clientId]) {
      clients[clientId] = rinfo;
    }

    if (message.match(/^</)) {
      console.log("Control message:", message);
      return;
    }

    for (let client in clients) {
      if (client !== clientId) {
        client = clients[client];
        server.send(
          new Buffer.from(message),
          0,
          message.length,
          client.port,
          client.address,
          (err, bytes) => {
            if ((err, bytes)) {
              console.error(err);
            }
            console.log("Bytes sent:", bytes);
          }
        );
      }
    }
  });
  server.on("listening", () => {
    console.log("Server ready", server.address());
  });

  server.bind(port);
}

module.exports = {
  Client,
  Server,
};

if (!module.parent) {
  switch (process.argv[2]) {
    case "client":
      new Client(process.argv[3]);
      break;
    case "server":
      new Server();
      break;
    default:
      console.log("Unknow option");
  }
}
