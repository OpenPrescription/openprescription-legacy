import axios from "axios";

export const createPrescription = (formData) => {
  return axios.post("/api/open-prescription-proxy/prescriptions", formData, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
    },
  });
};
