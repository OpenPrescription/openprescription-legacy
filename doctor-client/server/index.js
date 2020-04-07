require("dotenv").config();

const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./build"));
}

app.get("/", function (req, res) {
  return res.send("OK");
});
app.use("/api/blockchainid", require("./routes/blockchainid"));

app.use(
  "/api/originalmy-proxy",
  proxy(process.env.ORIGINALMY_API_URL, {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers["Authorization"] = process.env.ORIGINALMY_SECRET_KEY;
      proxyReqOpts.headers["origin"] = "https://localhost:3000";
      return proxyReqOpts;
    },
    proxyErrorHandler: function (err, res, next) {
      console.log(err);
      switch (err && err.code) {
        case "ECONNRESET": {
          return res.status(405).send("504 became 405");
        }
        case "ECONNREFUSED": {
          return res.status(200).send("gotcher back");
        }
        default: {
          next(err);
        }
      }
    },
  })
);

app.use(
  "/api/open-prescription-proxy/",
  proxy(process.env.API_HOST, {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers["Authorization"] =
        process.env.API_KEY;
      return proxyReqOpts;
    },
  })
);

app.listen(process.env.APP_SERVER_PORT, function () {
  console.log(`Express server running on ${process.env.APP_SERVER_PORT}`);
});
