import axios from "axios";

export const loginStatus = (nonceId) => {
  return axios.get(`/api/originalmy-proxy/login/status/${nonceId}`);
};

export const fetchUserByNonce = async (nonceId) => {
  return axios.get(`/api/blockchainid/user/${nonceId}`);
};

export const fetchNonce = (infos) =>
  axios.get(
    `/api/originalmy-proxy/login/nonce/${
      process.env.REACT_APP_ORIGINALMY_CLIENT_ID
    }/${process.env.REACT_APP_ORIGINALMY_ENV}/${infos.join(",")}`
  );
