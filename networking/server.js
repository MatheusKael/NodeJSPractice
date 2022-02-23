const net = require("net");
let clients = 0;

const server = net.createServer(function (client) {
  clients++;
  const clientId = clients;
  console.log("Client connected: " + clientId);

  client.on("error", (err) => {
    console.log(err);
  });
  client.on("end", () => {
    console.log("Client disconnected: " + clientId);
  });

  client.write("Welcome client: " + clientId + "rn");

  client.pipe(client);
});

server.listen(8000, () => {
  console.log("Server started on port 8000");
});
