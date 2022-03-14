const { clear } = require("console");
const fs = require("fs");
const tls = require("tls");

const options = {
  key: fs.readFileSync("server.pem"),
  cert: fs.readFileSync("server-cert.pem"),
  ca: [fs.readFileSync("client-cert.pem")],
  requestCert: true,
};

const server = tls.createServer(options, (cleartextstream) => {
  const authorized = cleartextstream.authorized ? "authorized" : "unauthorized";

  console.log("Connected", authorized);

  cleartextstream.write("welcome!\n");
  cleartextstream.setEncoding("utf-8");
  cleartextstream.pipe(cleartextstream);
});

server.listen(8000, function () {
  console.log("Server listening on port 8000");
});
