import axios from "axios";

export const validateDoctorId = async (doctorId) => {
  return {
    data: {
      isValid: true,
    }
  };
  return axios.get("/api/open-prescription-proxy/doctors/validate", {
    params: {
      doctorId,
    },
  });
};
