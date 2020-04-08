import React, { useEffect, useState } from "react";
import { setAccessToken, getDoctorId } from "../../helpers/storage";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
      <Dialog open={active} aria-labelledby="blockchain-id-signature-dialog">
        <DialogTitle id="blockchain-id-signature-dialog">
          <Trans i18nKey="signPrescriptionTitle">Sign prescription</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans i18nKey="signPrescriptionDescription">
              Scan QR Code with your Blockchain ID to sign and submit the
              prescription:
            </Trans>
          </DialogContentText>
          <Typography variant="body1">Doctor ID {getDoctorId()}</Typography>
          <BlockchainIdAuth
            active={active}
            infos={blockchainIdInfos}
            onAuthentication={(user) => {
              onSigned(user);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActive(false)} color="primary">
            <Trans i18nKey="cancel">Cancel</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
