require("dotenv").config();

const port = process.env.APP_SERVER_PORT || process.env.PORT || 1337;

const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");

const app = express();

app.use(express.static(path.resolve(__dirname, "../build")));

app.use(
  "/api/proxy/",
  proxy(process.env.API_HOST, {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Authorization"] = process.env.API_KEY;
      return proxyReqOpts;
    },
  })
);

app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

app.listen(port, function () {
  console.log(`Express server running on ${port}`);
});

if (process.env.NODE_ENV === "production") {
  const appHTTP = express();
  appHTTP.get("*", (req, res) => {
    console.log("redirect", process.env.NODE_ENV);
    res.redirect(`https://${req.headers.host}${req.url}`);
  });

  appHTTP.listen(port, err => {
    if (err) throw err;
    else console.log(`http port running at http://localhost:${port}`);
  });
}
