import axios from "axios";

export const fetchResume = (hash) => {
  return axios.get("/api/proxy/prescriptions/resume", {
    params: {
      hash,
    },
  });
};

export const sendDispensing = (data) => {
  return axios.post("/api/proxy/prescriptions/dispensing", {
    ...data,
  });
};
