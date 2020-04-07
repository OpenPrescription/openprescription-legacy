import { Prescription } from "../../models";
import { PatientPrescriptionMail } from "../../mails";

const notifyCreaction = (prescriptionFile, { patientName, patientEmail }) => {
  return new PatientPrescriptionMail({
    patientName,
  }).subject(__("Your Prescription"))
    .to(patientEmail, patientName)
    .from(process.env.MAIL_FROM)
    .send();
};

const create = (doctor, prescriptionFile, { patientName, patientEmail }) => {
  notifyCreaction(prescriptionFile, { patientName, patientEmail });
};

export default {
  create,
};
