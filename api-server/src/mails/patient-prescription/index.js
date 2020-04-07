import Mail from "../../tools/mail";

export default class PatientPrescriptionMail extends Mail {
  constructor(context) {
    super(context);
    this.template = "prescription";
  }
}
