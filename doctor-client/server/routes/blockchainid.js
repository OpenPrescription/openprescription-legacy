const express = require("express");
const Router = express.Router();

Router.get("/user/:nonce", async (req, res) => {
  console.log(req.params.nonce, process.env.ORIGINALMY_API_URL, process.env.ORIGINALMY_SECRET_KEY, process.env.ORIGINALMY_CLIENT_ID);
  try {
    const options = {
      uri: `${process.env.ORIGINALMY_API_URL}/login/user`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.ORIGINALMY_SECRET_KEY,
      },
      json: true,
      body: {
        cid: process.env.ORIGINALMY_CLIENT_ID,
        nonce: req.params.nonce,
      },
    };
    const result = await rp(options);
    console.log(result);
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
    console.log(err)
    return res.json(err);
  }
});

module.exports = Router;
