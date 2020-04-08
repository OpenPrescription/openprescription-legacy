//reference the plugin
import transporter from "../mail-transporter";

export default class Mail {
  constructor(context) {
    this.context = context || {};
    this.template = undefined;
  }

  static to(email) {
    const mail = new Mail();
    mail.to = email;
    return mail;
  }

  with(context) {
    this.context = context;
    return this;
  }

  from(email, name = null) {
    this.from = email;
    if (name) this.from = `${name}<${email}>`;
    return this;
  }

  to(email, name = null) {
    this.to = email;
    if (name) this.to = `${name}<${email}>`;
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
