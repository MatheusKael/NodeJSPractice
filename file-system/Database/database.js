const fs = require("fs");
const EventEmitter = require("events").EventEmitter;

const Database = function (path) {
  this.path = path;

  this._records = Object.create(null);
  this._writeStream = fs.createWriteStream(this.path, {
    encoding: "utf8",
    flags: "a",
  });

  this._load();
};

Database.prototype = Object.create(EventEmitter.prototype);

Database.prototype._load = function () {
  const stream = fs.createReadStream(this.path, { enconding: "utf8" });

  const database = this;

  stream.on("readable", function () {
    data += stream.read();

    const records = data.split("\n");

    data = records.pop();

    for (var i = 0; i < records.length; i++) {
      try {
        const record = JSON.parse(records[i]);
        if (record.value == null) {
          delete database._records(record.key);
        } else {
          database._records[record.key] = record.value;
        }
      } catch (e) {
        database.emit("error", "found invalid record:" + records[i]);
      }
    }
  });

  stream.on("end", () => {
    database.emit("load");
  });
};

Database.prototype.get = function (key) {
  return this._records[key] || null;
};

Database.prototype.set = function (key, value, cb) {
  const toWrite = JSON.stringify({ key, value }) + "\n";

  if (value == null) {
    delete this._records[key];
  } else {
    this._records[key] = value;
  }

  this._writeStream.write(toWrite, cb);
};

Database.prototype.del = function (key, cb) {
  return this.set(key, null, cb);
};

exports.module = database;
