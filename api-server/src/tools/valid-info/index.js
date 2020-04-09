import rp from "request-promise";

const {
  VALIDINFO_URL,
  VALIDINFO_COMPANY_CODE,
  VALIDINFO_USER,
  VALIDINFO_PASSWORD,
} = process.env;

/**
 * Request access token to Valid Info API
 * @returns {string} token
 */
export const getToken = async () => {
  const response = await rp({
    uri: `${VALIDINFO_URL}/GerarToken`,
    qs: {
      codigoEmpresa: VALIDINFO_COMPANY_CODE,
      usuario: VALIDINFO_USER,
      senha: VALIDINFO_PASSWORD,
    },
    transform: transformRequest,
  });
  return response.token;
};

/**
 * Get person signup from Valid Info API
 * @param {string} document
 * @returns {Promise} signup
 */
const getDoctorSignUp = async (document) => {
  const token = await this.getToken();
  const response = await rp({
    uri: `${VALIDINFO_URL}/CadastroCompletoPF`,
    method: "GET",
    qs: {
      token,
      documento: document,
    },
    transform: transformRequest,
  });
  if (response.erro) return null;
  return new ValidInfoIndividual(response);
};
