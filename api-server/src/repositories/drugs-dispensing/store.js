import { DrugsDispensing, Prescription } from "../../models";
import { PrescriptionNotFoundError } from "../../errors";

const create = async (
  pharmacistId,
  pharmacyId,
  prescriptionId,
  purchaserDocumentId,
  ip
) => {
  const prescription = await Prescription.findByPk(prescriptionId);
  if (!prescription) throw new PrescriptionNotFoundError();
  return DrugsDispensing.create({
    prescriptionId,
    pharmacyId,
    pharmacistId,
    purchaserDocumentId,
    digitalSignature: prescription.digitalSignature,
    ip,
  });
};

export default {
  create,
};
