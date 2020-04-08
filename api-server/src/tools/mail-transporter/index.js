import hbs from "nodemailer-express-handlebars";
import handlebars from "express-handlebars";
import nodemailer from "nodemailer";
import path from "path";
import i18n from "i18n";

const smtpConfig = {
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
const transporter = nodemailer.createTransport(smtpConfig);
//attach the plugin to the nodemailer transporter
transporter.use(
  "compile",
  hbs({
    viewEngine: handlebars.create({
      extname: "hbs",
      layoutsDir: path.resolve(__dirname, "../../views/mails/layouts/"),
      defaultLayout: "main",
      partialsDir: path.resolve(__dirname, "../../views/mails/partials/"),
      helpers: {
        __: function () {
          return i18n.__.apply(this, arguments);
        },
        __n: function () {
          return i18n.__n.apply(this, arguments);
        },
      },
    }),
    viewPath: path.resolve(__dirname, "../../", "views/mails"),
    extName: ".hbs",
  })
);
export default transporter;
