const { DrugsDispensing } = require("../../models");

const create = (pharmacistId, pharmacyId, hash, ip) => {
  DrugsDispensing.create({
    prescriptionId,
    pharmacyId,
    pharmacistId,
    purchaserDocumentId,
    digitalSignature,
    ip,
  });
};

export default {
  create,
};
