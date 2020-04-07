const { Doctor } = require("../../models");

const getOrCreate = async ({ name, email, blockchainId, documentId }) => {
  const doctor = await Doctor.findOne({
    where: {
      documentId,
    },
  });
  if (doctor) return doctor;
  return Doctor.create({
    name,
    email,
    blockchainId,
    documentId,
  });
};

export default {
  getOrCreate,
};
