import MedicalValidator from "../../tools/medical-validator";
import Doctor from "../../tools/medical-validator/interfaces/doctor.interface";

export const nationalId = async (countryCode, { id, name }) => {
  const doctor = new Doctor();
  doctor.id = id;
  doctor.name = name;
  return MedicalValidator.validate(countryCode, doctor);
};

export default {
  nationalId,
};
