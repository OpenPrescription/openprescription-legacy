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
      <Typography variant="subtitle1" component="p" style={{ textAlign: 'center'}}>
        <Trans i18nKey="signPrescriptionTitle">Submission done successfully!</Trans>
      </Typography>
      <Typography component="p" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '30px', marginBottom: '60px'}}>
        <Trans i18nKey="signPrescriptionDescription">
          Now open your OriginalMy app and scan this QR Code to validate your identity.
        </Trans>
      </Typography>

      
      <BlockchainIdAuth
        active={active}
        infos={blockchainIdInfos}
        onAuthentication={(user) => {
          onSigned(user);
        }}
        doctorId={getDoctorId()}
        prescriptionHash={prescription.hash}
      />
    </div>
  );
};
