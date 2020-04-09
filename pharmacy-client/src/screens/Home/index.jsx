import React, { useState, useEffect } from "react";
import sha256 from "crypto-js/sha256";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import UploadInput from "./../../components/UploadInput";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import Backdrop from "@material-ui/core/Backdrop";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  fetchResume as fetchPrescriptionResume,
  sendDispensing as sendPrescriptionDispensing,
} from "../../data/prescriptions";
import { Trans, useTranslation } from "react-i18next";
import Alert from "@material-ui/lab/Alert";
import { useUser } from "../../contexts/User";
import { useHistory, useParams } from "react-router-dom";

export default () => {
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaserDocumentId, setPurchaserDocumentId] = useState("");
  const [fetchResponse, setFetchResponse] = useState(false);
  const [purchaserError, setPurchaserError] = useState(false);
  const [isDispensable, setDispensable] = useState(false);
  const [
    prescriptionDispensingStatus,
    setPrescriptionDispensingStatus,
  ] = useState("");
  const user = useUser();
  const { t } = useTranslation();
  let history = useHistory();
  let { pathHash } = useParams();

  const toSha256 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsOriginalMy(file);
      reader.onload = () => resolve(sha256(reader.getAsOriginalMyString()));
      reader.onerror = (error) => reject(error);
    });

  const onUploadPrescription = async (files) => {
    setLoading(true);
    setPrescriptionFile(files[0]);
    const hash = await toSha256(files[0]);
    history.push(`${hash}`);
    setLoading(false);
  };

  const getPrecription = async (hash) => {
    try {
      const {
        data: { data },
      } = await fetchPrescriptionResume(hash);
      data.isExpired = new Date(data.prescription.expirationDate) <= new Date();
      data.noUseLeft = data.prescription.usesCount == data.prescription.maxUses;
      setPrescriptionData(data);
      setDispensable(!data.isExpired && !data.noUseLeft);
      setFetchResponse("success");
    } catch (err) {
      switch (err.response && err.response.status) {
        case 404:
          setFetchResponse("404");
          break;
        default:
          setFetchResponse("error");
          break;
      }
    }
  };

  const sendDispensa = async (e) => {
    e.preventDefault();
    const data = {
      pharmacist: {
        documentId: user.documentId,
        companyId: user.companyId,
      },
      purchaserDocumentId,
      prescriptionId: prescriptionData.prescription.id,
    };
    if (!purchaserDocumentId) {
      setPurchaserError(true);
    } else {
      setPurchaserError(false);
    }
    try {
      await sendPrescriptionDispensing(data);
      setModalOpen(false);
      window.scrollTo(0, 0);
      getPrecription(pathHash);
      setPrescriptionDispensingStatus("success");
    } catch (err) {
      setModalOpen(false);
      setPrescriptionDispensingStatus("error");
    }
  };

  const getFormattedDate = (date) => {
    if (!date) return null;
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const useStyles = makeStyles((theme) => ({
    whiteContainer: {
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      padding: "120px",
      backgroundColor: theme.palette.background.paper,
    },
    solidContainer: {
      paddingTop: theme.spacing(4),
      marginBottom: theme.spacing(6),
    },
    input: {
      marginBottom: "20px",
    },
    button: {
      display: "block",
      margin: "30px auto 0",
      width: "100%",
    },
    divider: {
      margin: "20px 0",
    },
    modalContent: {
      padding: "10px 30px 30px",
    },
    modalTitle: {
      padding: "30px 30px 0",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    alerts: {
      marginBottom: theme.spacing(2),
    },
  }));

  const {
    whiteContainer,
    backdrop,
    solidContainer,
    input,
    button,
    divider,
    modalContent,
    modalTitle,
    alerts,
  } = useStyles();

  useEffect(() => {
    if (pathHash) {
      getPrecription(pathHash);
    }
  }, [pathHash]);

  return (
    <section>
      <Container maxWidth="sm" style={{ paddingTop: 20 }}>
        {fetchResponse == "404" && (
          <Alert severity="error" className={alerts}>
            <Trans i18nKey="prescriptionNotFoundError">
              Prescription not found!
            </Trans>
          </Alert>
        )}
        {fetchResponse == "error" && (
          <Alert severity="error" className={alerts}>
            <Trans i18nKey="prescriptionUnexpectedError">
              Unexpected error. Try again later.
            </Trans>
          </Alert>
        )}
        {prescriptionDispensingStatus == "error" && (
          <Alert severity="error" className={alerts}>
            <Trans i18nKey="prescriptionDispensingUnexpectedError">
              Unexpected error. Try again later.
            </Trans>
          </Alert>
        )}
        {prescriptionDispensingStatus == "success" && (
          <Alert severity="success" className={alerts}>
            <Trans i18nKey="prescriptionDispensedSuccess">
              Prescription dispensed successfuly
            </Trans>
          </Alert>
        )}
        <Typography variant="body2">
          Pharmacist Logged: {user.documentId}
        </Typography>
        <UploadInput
          multiple={false}
          onChange={onUploadPrescription}
          containerStyle={{
            display: "flex",
            width: "100%",
            paddingTop: "2rem",
          }}
          label={
            prescriptionFile ? prescriptionFile.name : t("checkPrescription")
          }
          inputProps={{
            id: "prescriptionFile",
            name: "prescriptionFile",
            accept: ".pdf",
          }}
        />
      </Container>
      {prescriptionData && (
        <Container maxWidth="sm" className={solidContainer}>
          {prescriptionData.isExpired && (
            <Alert severity="warning" className={alerts}>
              <Trans i18nKey="prescriptionIsExired">
                Prescription is expired
              </Trans>
            </Alert>
          )}
          {prescriptionData.noUseLeft && (
            <Alert severity="warning" className={alerts}>
              <Trans i18nKey="prescriptionNoUsesLeft">
                The prescription reached the maximum number of uses
              </Trans>
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Doctor Name</Typography>
              <Typography variant="body1">
                {prescriptionData.doctor.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Doctor Document ID</Typography>
              <Typography variant="body1">
                {prescriptionData.doctor.documentId}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Doctor Blockchain ID</Typography>
              <Typography variant="body1">
                {prescriptionData.doctor.blockchainid}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Doctor E-mail</Typography>
              <Typography variant="body1">
                {prescriptionData.doctor.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Doctor Company ID</Typography>
              <Typography variant="body1">
                {prescriptionData.doctor.companyId}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Patient Name</Typography>
              <Typography variant="body1">
                {prescriptionData.patient.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Patient Document ID</Typography>
              <Typography variant="body1">
                {prescriptionData.patient.documentId}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Patient E-mail</Typography>
              <Typography variant="body1">
                {prescriptionData.patient.email}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Max Uses</Typography>
              <Typography variant="body1">
                {prescriptionData.prescription.maxUses}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Uses Count</Typography>
              <Typography variant="body1">
                {prescriptionData.prescription.usesCount}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Last Use At</Typography>
              <Typography variant="body1">
                {getFormattedDate(prescriptionData.prescription.lastUseAt) ||
                  t("neverUsed")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Created At</Typography>
              <Typography variant="body1">
                {getFormattedDate(prescriptionData.prescription.createdAt)}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          {prescriptionData.invalidAt ||
            (prescriptionData.expiredAt && (
              <Grid container spacing={2}>
                {prescriptionData.invalidAt && (
                  <Grid item xs={6}>
                    <Typography variant="body2">Invalid At</Typography>
                    <Typography variant="body1">
                      {getFormattedDate(
                        prescriptionData.prescription.invalidAt
                      )}
                    </Typography>
                  </Grid>
                )}
                {prescriptionData.expiredAt && (
                  <Grid item xs={6}>
                    <Typography variant="body2">Expired At</Typography>
                    <Typography variant="body1">
                      {getFormattedDate(
                        prescriptionData.prescription.expirationDate
                      )}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ))}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Signature</Typography>
              <Typography variant="body1" style={{ wordBreak: "break-all" }}>
                {prescriptionData.block.signature}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Message</Typography>
              <Typography variant="body1" style={{ wordBreak: "break-all" }}>
                {prescriptionData.block.message}
              </Typography>
            </Grid>
          </Grid>

          {isDispensable && (
            <Button
              variant="contained"
              color="secondary"
              className={button}
              onClick={() => setModalOpen(true)}
            >
              Dispense
            </Button>
          )}
          {modalOpen && (
            <Dialog
              open={modalOpen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className={modalTitle} id="alert-dialog-title">
                Insert purchaser document ID to finish
              </DialogTitle>
              <DialogContent className={modalContent}>
                <form noValidate onSubmit={sendDispensa}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="purchaserDocumentId"
                    name="purchaserDocumentId"
                    label="Purchaser Document ID"
                    type="text"
                    fullWidth
                    required
                    onChange={(e) => setPurchaserDocumentId(e.target.value)}
                    value={purchaserDocumentId}
                    className={input}
                    error={purchaserError}
                  />
                  {purchaserError && (
                    <FormHelperText error={true}>
                      <Trans i18nKey="purchaserIdRequired">
                        Purchaser ID is required
                      </Trans>
                    </FormHelperText>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={button}
                  >
                    submit
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </Container>
      )}
      {loading && (
        <Backdrop className={backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </section>
  );
};
