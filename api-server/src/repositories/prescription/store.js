import { Prescription } from "../../models";
import { PatientPrescriptionMail } from "../../mails";
import { PDFHtml } from "../../tools/pdf-kit";
import rp from "request-promise";
import crypto from "crypto";

const notifyCreaction = (
  prescriptionFile,
  certificate,
  { patientName, patientEmail, doctorName }
) => {
  return new PatientPrescriptionMail({
    username: patientName,
    doctorName,
  })
    .subject(__("Your Prescription"))
    .attach(new Buffer(prescriptionFile, "base64"), __("prescription.pdf"))
    .attach(certificate, __("prescription-certificate.pdf"))
    .to(patientEmail, patientName)
    .from(process.env.MAIL_FROM, process.env.MAIL_FROM_NAME)
    .send();
};

const createCertificate = async ({
  prescriptionId,
  patientName,
  patientEmail,
  patientDocumentId,
  doctorName,
  doctorId,
  doctorEmail,
  hash,
  maxUses,
  expiredAt,
  isPrivate,
  blockSignature,
}) => {
  const blockSignaturePieces = blockSignature.split(";");
  const message = blockSignaturePieces[0];
  const blockchainId = blockSignaturePieces[1];
  const digitalSignature = blockSignaturePieces[2];
  const pdf = await new PDFHtml().template("certificate").compile({
    prescriptionId,
    patientName,
    patientEmail,
    patientDocumentId,
    doctorName,
    doctorId,
    doctorEmail,
    prescriptionHash: hash,
    maxUses,
    expiration: expiredAt,
    isPrivate: isPrivate ? "Yes" : __("No"),
    blockchainId,
    message,
    digitalSignature,
  });
  return pdf.buffer();
};

const certifyDocument = (digest) => {
  return rp({
    uri: `${process.env.ORIGINALMY_API_URL}/company/document/register`,
    method: "POST",
    headers: {
      authorization: process.env.ORIGINALMY_SECRET_KEY,
      origin: process.env.API_HOST,
      "Content-Type": "application/json",
    },
    body: {
      digest,
    },
    json: true,
  });
};

const buffer2sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const create = async (doctor, prescriptionFile, data) => {
  const {
    patientName,
    patientEmail,
    company,
    hash,
    maxUses,
    digitalSignature,
    expirationDate,
    ip,
  } = data;
  const prescription = await Prescription.create({
    doctorId: doctor.id,
    doctorName: doctor.name,
    patientName,
    patientDocumentId: data.patientId,
    patientEmail,
    doctorCompanyId: company.id,
    hash,
    maxUses,
    private: data.isPrivate,
    digitalSignature,
    expiredAt: expirationDate,
    ip,
  });
  const certificate = await createCertificate({
    prescriptionId: prescription.id,
    patientName,
    patientEmail,
    patientDocumentId: data.patientId,
    doctorName: doctor.name,
    doctorEmail: doctor.email,
    doctorId: doctor.id,
    hash,
    maxUses,
    expiredAt: expirationDate,
    isPrivate: data.isPrivate,
    blockSignature: JSON.parse(data.doctor).block,
  });
  console.log("CERTIFY PRESCRIPTION");
  const resPres = await certifyDocument(hash); // Certify prescription document in blockchain
  console.log("CERTIFY CERTIFICATE");
  const certificateHash = buffer2sha256(certificate).toString();
  const resCert = await certifyDocument(certificateHash); // Certify prescription certificate in blockchain
  console.log(resPres, resCert);
  prescription.certificateHash = certificateHash;
  prescription.save();
  notifyCreaction(prescriptionFile, certificate, {
    patientName,
    patientEmail,
    doctorName: doctor.name,
  });
};

export default {
  create,
  certifyDocument,
  createCertificate,
  notifyCreaction,
};
