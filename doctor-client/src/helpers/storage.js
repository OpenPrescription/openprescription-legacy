export const ACCESS_TOKEN_KEY = "GdApmru9y2Ns3TB7";
export const MEDICAL_ID_KEY = "pcJLcV2YVxVx7CkH";
export const USER_KEY = "j7WLTaNUp4Gfn8q4";

export const setAccessToken = (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setDoctorId = (doctorId) => {
  localStorage.setItem(MEDICAL_ID_KEY, doctorId);
};

export const getDoctorId = () => {
  return localStorage.getItem(MEDICAL_ID_KEY);
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const storageUser = localStorage.getItem(USER_KEY);
  if (!storageUser) return null;
  return JSON.parse(storageUser);
};
