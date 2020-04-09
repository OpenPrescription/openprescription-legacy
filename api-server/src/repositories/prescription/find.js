import { Prescription, Sequelize, Doctor, DrugsDispensing } from "../../models";
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
    include: [
      {
        model: Doctor,
      },
      {
        model: DrugsDispensing,
        order: [["createdAt", "DESC"]],
      },
    ],
  });
  if (prescription == null) throw new PrescriptionNotFoundError();

  const digitalSignaturePieces = prescription.digitalSignature.split(";");
  const message = digitalSignaturePieces[0];
  const blockchainid = digitalSignaturePieces[1];
  const signature = digitalSignaturePieces[2];
  const block = digitalSignaturePieces[3];
  const dispensing = prescription.DrugsDispensings;
  const usesCount = dispensing.length;
  const doctor = prescription.Doctor;
  return {
    doctor: {
      name: doctor.name,
      documentId: doctor.documentId,
      blockchainid: doctor.blockchainId,
      email: doctor.email,
      companyId: prescription.doctorCompanyId,
    },
    patient: {
      name: prescription.patientName,
      email: prescription.patientEmail,
      documentId: prescription.patientDocumentId,
    },
    prescription: {
      id: prescription.id,
      maxUses: prescription.maxUses,
      usesCount,
      lastUseAt: usesCount ? dispensing[0].createdAt : null,
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
