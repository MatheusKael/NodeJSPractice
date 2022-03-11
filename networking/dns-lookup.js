const dns = require("dns");

// According to Node’s documentation, dns.lookup is backed by a thread pool,
// whereas dns.resolve uses the c-ares library, which is faster. The dns.lookup
// API is a little friendlier—it uses getaddrinfo, which is more consistent with
// the other programs on your system. Indeed, the Socket.prototype.connect method,
// and any of Node’s core modules that inherit from the objects in the net module,
// all use dns.lookup for consistency:

// dns.lookup("www.manning.com", (err, address) => {
//   if (err) {
//     console.log(err);
//   }

//   console.log("address: ", address);
// });

dns.resolve("www.manning.com", (err, address) => {
  if (err) {
    console.log(err);
  }

  console.log("address: ", address);
});
