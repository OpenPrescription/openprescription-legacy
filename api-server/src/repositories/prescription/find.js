import { Prescription, Sequelize, Doctor } from "../../models";
import PrescriptionNotFoundError from "../../errors/prescription-not-found";
const Op = Sequelize.Op;

const pharmacyResume = async (hash) => {
  const prescription = await Prescription.findOne({
    where: {
      [Op.or]: {
        hash,
        certificateHash: hash,
      },
    },
    include: {
      model: Doctor,
    },
  });
  if (prescription == null) throw new PrescriptionNotFoundError();

  const digitalSignaturePieces = prescription.digitalSignature.split(";");
  const message = digitalSignaturePieces[0];
  const blockchainid = digitalSignaturePieces[1];
  const signature = digitalSignaturePieces[2];
  const block = digitalSignaturePieces[3];
  return {
    doctor: {
      name: prescription.Doctor.name,
      documentId: prescription.Doctor.documentId,
      blockchainid: prescription.Doctor.blockchainId,
      email: prescription.Doctor.email,
      companyId: prescription.doctorCompanyId,
    },
    patient: {
      name: prescription.patientName,
      email: prescription.patientEmail,
      documentId: prescription.patientDocumentId,
    },
    prescription: {
      maxUses: prescription.maxUses,
      usesCount: 1,
      lastUseAt: "2019-04-07T11:31:00Z",
      createdAt: prescription.createdAt,
      invalidAt: prescription.invalidAt,
      expirationDate: prescription.expiredAt,
      private: Boolean(prescription.private),
      prescriptionHash: prescription.hash,
      certificateHash: prescription.certificateHash,
    },
    block: {
      message,
      blockchainid,
      signature,
      block,
    },
  };
};

export default {
  pharmacyResume,
};
