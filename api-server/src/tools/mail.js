//reference the plugin
import transporter from "./mail-transporter";

export default class Mail {
  constructor(context) {
    this.context = context;
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
    return this;
  }

  send() {
    return transporter.sendMail(this);
  }
}
