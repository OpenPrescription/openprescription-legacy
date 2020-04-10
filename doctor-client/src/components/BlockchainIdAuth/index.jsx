import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  loginStatus,
  fetchUserByNonce,
  fetchNonce,
} from "../../data/blockchainid";

export default ({
  active,
  infos = ["name", "email", "id", "blockchainid"],
  onError,
  onExpired,
  authInterval = 3000,
  ...props
}) => {
  const { t } = useTranslation();
  const [qrcode, setQrcode] = useState(null);
  const [authIntervalActive, setAuthIntervalStatus] = useState(active);

  const authDataResultIsValid = (data) => {
    if (data && data.status !== "success") {
      if (data && data.data && data.data.type === "expired") {
        return "expired";
      }
      return "error";
    } else if (data.data && data.data.auth) {
      return "auth";
    }
    return "re-check";
  };

  const onAuthentication = async (nonceId) => {
    setAuthIntervalStatus(false);
    const userResponse = await fetchUserByNonce(nonceId);
    const user = {};
    for (const key in userResponse.data.data) {
      const element = userResponse.data.data[key];
      user[key] = element.value;
    }
    if (typeof props.onAuthentication === "function")
      props.onAuthentication(user);
  };

  const startAuthCheck = async (nonceId) => {
    try {
      const authResponse = await loginStatus(nonceId);
      const status = authDataResultIsValid(authResponse.data);
      if (status === "re-check") {
        if (authIntervalActive)
          setTimeout(startAuthCheck, authInterval, [nonceId]);
        return false;
      } else if (status === "auth") {
        onAuthentication(nonceId);
      } else if (status === "expired") {
        setQrcode(null);
      } else if (status === "error") {
        throw new Error(authResponse.data.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getQRCode = async () => {
    try {
      const nonceResponse = await fetchNonce(infos);
      if (nonceResponse.data.status !== "success")
        throw new Error(nonceResponse.data.data.message);
      const nonce = nonceResponse.data.data.auth;
      setQrcode(nonce.qrcode);
      startAuthCheck(nonce.nonce.nid);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!qrcode) getQRCode();
    setAuthIntervalStatus(active);
  }, [ qrcode ]);

  return (
    <div>
      {qrcode && (
        <img
          src={qrcode}
          style={{ display: "block", margin: "auto" }}
          alt={t("doctorQrcodeSign")}
        />
      )}
    </div>
  );
};
