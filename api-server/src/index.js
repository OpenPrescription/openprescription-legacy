import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { PrescriptionRouter } from "./routes";
import ResponseMiddleware from "./middlewares/responses";
import i18n from "i18n";

i18n.configure({
  locales: ["en", "pt"],
  directory: __dirname + "/locales",
  register: global,
});

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true, limit: "150mb" }));
app.use(express.json({ limit: "100mb" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(ResponseMiddleware);

app.get("/", (req, res) => {
  return res.send("Server UP");
});
app.use("/prescriptions", PrescriptionRouter);

app.listen(process.env.PORT || 53535, function (PORT) {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    process.env.NODE_ENV
  );
});
