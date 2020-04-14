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

const validateData = async (doctorId, data) => {
  Doctor.update(
    {
      lastVerificationAt: new Date(),
      doctorExtraInfo: JSON.stringify(data),
    },
    {
      where: {
        documentId: doctorId,
      },
    }
  );
};

export default {
  getOrCreate,
  validateData,
};
