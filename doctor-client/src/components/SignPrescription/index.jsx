import React, { useEffect, useState } from "react";
import { setAccessToken, getDoctorId } from "../../helpers/storage";
import { Trans } from "react-i18next";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import BlockchainIdAuth from "../BlockchainIdAuth";

export default ({ prescription, onSigned }) => {
  const [active, setActive] = useState(true);
  const blockchainIdInfos = [
    "name",
    "email",
    "id",
    "blockchainid",
    `ref=${JSON.stringify({
      doctorId: getDoctorId(),
      prescriptionHash: prescription.hash,
      expirationDate: prescription.expirationDate,
      maxUses: prescription.maxUses,
      doctorCompanyId: prescription.doctorCompanyId,
    })}`,
  ];

  return (
    <div>
      <Trans i18nKey="signPrescriptionTitle">Sign prescription</Trans>
        <Trans i18nKey="signPrescriptionDescription">
          Scan QR Code with your Blockchain ID to sign and submit the
          prescription:
        </Trans>
      <Typography variant="body1">Doctor ID {getDoctorId()}</Typography>
      <BlockchainIdAuth
        active={active}
        infos={blockchainIdInfos}
        onAuthentication={(user) => {
          onSigned(user);
        }}
      />
    </div>
  );
};
