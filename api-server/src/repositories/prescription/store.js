import { Prescription } from "../../models";
import { PatientPrescriptionMail } from "../../mails";

const notifyCreaction = (prescriptionFile, { patientName, patientEmail }) => {
  return new PatientPrescriptionMail({
    patientName,
  })
    .subject(__("Your Prescription"))
    .attach(new Buffer(prescriptionFile, "base64"), __("prescription.pdf"))
    .to(patientEmail, patientName)
    .from(process.env.MAIL_FROM)
    .send();
};

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
  notifyCreaction(prescriptionFile, { patientName, patientEmail });
};

export default {
  create,
};
