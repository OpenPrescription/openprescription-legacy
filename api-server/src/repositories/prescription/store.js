import { Prescription } from "../../models";
import { PatientPrescriptionMail } from "../../mails";

const notifyCreaction = (prescriptionFile, { patientName, patientEmail }) => {
  return new PatientPrescriptionMail({
    username: patientName,
  })
    .subject(__("Your Prescription"))
    .attach(new Buffer(prescriptionFile, "base64"), __("prescription.pdf"))
    .attach(new Buffer(prescriptionFile, "base64"), __("prescription.pdf"))
    .to(patientEmail, patientName)
    .from(process.env.MAIL_FROM, process.env.MAIL_FROM_NAME)
    .send();
};

const createCertificate = ({ digitalSignature }) => {};

const create = async (doctor, prescriptionFile, data) => {
  const {
    patientName,
    patientEmail,
    doctorCompanyId,
    hash,
    maxUses,
    digitalSignature,
    expirationDate,
    ip,
  } = data;
  try {
    await Prescription.create({
      doctorId: doctor.id,
      patientName: data.patientName,
      patientDocumentId: data.patientId,
      patientEmail,
      doctorCompanyId,
      hash,
      maxUses,
      private: data.isPrivate,
      digitalSignature,
      expiredAt: expirationDate,
      ip,
    });
  } catch (err) {}
  notifyCreaction(prescriptionFile, { patientName, patientEmail });
};

export default {
  create,
};
