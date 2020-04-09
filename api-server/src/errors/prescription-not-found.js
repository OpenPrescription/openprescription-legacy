import ApplicationError from "./application";

export default class PrescriptionNotFoundError extends ApplicationError {
  constructor() {
    super(__("Prescription not found"));
    this.code = "000001";
    this.statusCode = 404;
  }
}
