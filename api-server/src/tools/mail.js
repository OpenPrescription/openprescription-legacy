//reference the plugin
import transporter from "./mail-transporter";

export default class Mail {
  constructor(context) {
    this.context = context || {};
    this.template = undefined;
  }

  from(email) {
    this.from = email;
    return this;
  }

  to(email) {
    this.to = email;
    return this;
  }

  subject(subject) {
    this.subject = subject;
    this.context.subject = subject;
    return this;
  }

  attach(fileBuffer, name, contentType) {
    if (!this.attachments) this.attachments = [];
    this.attachments.push({
      filename: name,
      content: fileBuffer,
      contentType: contentType || "application/pdf",
    });
    return this;
  }

  send() {
    return transporter.sendMail(this);
  }
}
