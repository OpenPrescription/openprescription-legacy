import React, { useEffect, useState } from "react";
import { setAccessToken, getDoctorId } from "../../helpers/storage";
import { Trans } from "react-i18next";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import BlockchainIdAuth from "../BlockchainIdAuth";
import { makeStyles } from "@material-ui/core/styles";

import shippingPackage from './../../assets/shipping-package.svg';

export default ({ prescription, onSigned }) => {
  const [active, setActive] = useState(true);
  const [doneAuth, setDoneAuth] = useState(false);
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

  const useStyles = makeStyles((theme) => ({
    prescriptionTitle: {
      fontSize: 20,
      color: '#00767A',
      fontWeight: 900,
      textAlign: 'center',
      marginBottom: 40
    },
  }));

  const { prescriptionTitle } = useStyles();

  return (
    <>
      {!doneAuth && (
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
      )}
      {doneAuth && (
        <div style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', maxWidth: '90%' }}>
          <Typography
            variant="body2"
            component="p"
            className={prescriptionTitle}
          >
            <Trans i18nKey="prescriptionSent">
              Thank you, your prescription was sent!
            </Trans>
          </Typography>
          <img src={shippingPackage} />
        </div>
      )}
    </>
  );
};
