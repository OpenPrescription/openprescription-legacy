export default class ApplicationError {
  constructor(message) {
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 500;
    this.status = "fail";
    this.code = null;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}
