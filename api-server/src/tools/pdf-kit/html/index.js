import Html2PDF from "html-pdf";
import Handlebars from "express-handlebars";
import config from "./config";
import path from "path";

export default class Html {
  template(template) {
    this.template = template;
    return this;
  }

  _renderTemplate(handlebars, template, context) {
    return new Promise((resolve, reject) => {
      handlebars.renderView(
        path.resolve(__dirname, "../../../views/documents", `${template}.hbs`),
        Object.assign(context, { layout: "main" }),
        (err, html) => {
          if (err) reject(err);
          return resolve(html);
        }
      );
    });
  }

  async compile(context) {
    const handlebars = Handlebars.create({
      partialsDir: path.resolve(__dirname, "../../../views/documents/partials"),
      extname: ".hbs",
      defaultLayout: "main",
      layoutsDir: path.resolve(__dirname, "../../../views/documents/layouts"),
    });
    this.compliedHtml = await this._renderTemplate(handlebars, this.template, context);
    return this;
  }

  buffer() {
    if (!this.compliedHtml) throw new Error("No compiled HTML");
    return new Promise((resolve, reject) => {
      try {
        Html2PDF.create(this.compliedHtml, config).toBuffer((err, buffer) => {
          if (err) return reject(err);
          resolve(buffer);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
}
