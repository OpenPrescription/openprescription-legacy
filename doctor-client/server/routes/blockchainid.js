const express = require("express");
const rp = require("request-promise");
const crypto = require("crypto");
const Router = express.Router();

Router.get("/user/:nonce", async (req, res) => {
  try {
    const options = {
      uri: `${process.env.ORIGINALMY_API_URL}/login/user`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: new Buffer(
          process.env.ORIGINALMY_SECRET_KEY,
          "base64"
        ).toString(),
        Origin: process.env.APP_HOST,
      },
      json: true,
      body: {
        cid: process.env.ORIGINALMY_CLIENT_ID,
        nonce: req.params.nonce,
      },
    };
    const result = await rp(options);
    const decipher = crypto.createDecipheriv(
      "aes256",
      process.env.ORIGINALMY_CRYPT_KEY,
      process.env.ORIGINALMY_CRYPT_IV
    );
    let user = decipher.update(result.data.user, "base64", "utf8");
    user += decipher.final("utf8");
    user = JSON.parse(user);
    return res.json({ status: "success", data: user });
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

module.exports = Router;
