const { response } = require("express");
const http = require("http");
const https = require("https");

const url = require("url");

let request;

function Request() {
  this.maxRedirects = 20;
  this.redirects = 0;
}

Request.prototype.get = function (href, callback) {
  const uri = url.parse(href);
  const options = { host: uri.host, path: uri.path };

  const httpGet = uri.protocol === "http:" ? http.get : https.get;

  console.log("GET:", href);
  function processResponse(response) {
    if (response.statusCode >= 300 && response.statusCode < 400) {
      if (this.redirects >= this.maxRedirects) {
        this.error = new Error("Too many redirects for:" + href);
      } else {
        this.redirects++;
        href = url.resolve(options.host, response.headers.location);
        return this.get(href, callback);
      }
    }
    response.url = href;
    response.redirects = this.redirects;
    console.log("Redirected:", href);

    function end() {
      console.log("Connection ended");
      callback(this.error, response);
    }

    response.on("end", end.bind());
  }

  httpGet(options, processResponse.bind(this)).on("error", (err) => {
    callback(err);
  });
};

request = new Request();

request.get("https://google.com/", function (err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log("Fetched URL:", res.url, "with", res.redirects, "redirects");
    process.exit();
  }
});
