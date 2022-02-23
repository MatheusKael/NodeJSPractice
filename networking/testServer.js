const assert = require("assert");
const net = require("net");
const { runInThisContext } = require("vm");
let clients = 0;
let expectedAssertions = 2;

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

  client.write("Welcome client: " + clientId + "\r\n");

  client.pipe(client);
});

server.listen(8000, () => {
  console.log("Server started on port 8000");

  runTest(1, () => {
    runTest(2, () => {
      console.log("Tests finished");
      assert.equal(0, expectedAssertions);
      server.close();
    });
  });
});

function runTest(expectedId, done) {
  const client = net.connect(8000);

  client.on("data", function (data) {
    const expected = "Welcome client: " + expectedId + "\r\n";
    assert.equal(data.toString(), expected);
    expectedAssertions--;
    client.end();
  });
  client.on("end", done);
}
