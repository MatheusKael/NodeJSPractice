const fs = require("fs");
const https = require("https");

const options = {
  key: fs.readFileSync("server.pem"),
  cert: fs.readFileSync("server-crt.pem"),
  ca: [fs.readFileSync("client-cert.pem")],
  requestCert: true,
};

const server = https.createServer(options, (req, res) => {
  const authorized = req.socket.authorized ? "authorized" : "unauthorized";

  res.writeHead(200), res.write("Welcome! You are " + authorized + "\n");
  res.end();
});

server.listen(8000, () => {
  console.log("Server listening");
});
