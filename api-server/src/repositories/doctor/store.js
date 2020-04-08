const { Doctor } = require("../../models");

const getOrCreate = async ({ name, email, blockchainid, documentId }) => {
  const doctor = await Doctor.findOne({
    where: {
      documentId: documentId,
    },
  });
  if (doctor) return doctor;
  return Doctor.create({
    name,
    email,
    blockchainId: blockchainid,
    documentId: documentId,
  });
};

export default {
  getOrCreate,
};
