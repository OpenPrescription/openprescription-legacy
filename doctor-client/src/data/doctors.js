import axios from "axios";

export const validateDoctorId = async (doctorId, userName, userCountry) => {
  return axios.post("/api/proxy/doctors/validate", {
    doctor: {
      id: doctorId,
      name: userName,
      country: userCountry,
    },
  });
};
