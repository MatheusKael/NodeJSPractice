const database = require("./database");
const client = new Database("./test.db");

client.on("load", () => {
  const foo = client.get("foo");

  client.set("bar", "my sweet value", function (err) {
    if (err) return console.error(err);

    console.log("write successful!");
  });

  client.del("baz");
});
