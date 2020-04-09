/**
 * Convert response body from xml to js
 * @param {string} XML Body
 * @returns {Promise} Converted body
 */
export const convertBody = (body) => {
  return new Promise((resolve, reject) => {
    xml2js(body, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/**
 * Transform RP request
 * @param {Object} body
 * @returns {string} XML Body
 */
export const transformRequest = async (
  body,
  response,
  resolveWithFullResponse
) => {
  if (response.headers["content-type"] === "text/xml; charset=utf-8") {
    const convertedBody = await convertBody(body);
    return convertedBody;
  }
  return body;
};
