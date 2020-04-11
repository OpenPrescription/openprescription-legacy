import React, { useState, useEffect } from "react";
import sha256 from "js-sha256";
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
import IconButton from "@material-ui/core/IconButton";
import {
  fetchResume as fetchPrescriptionResume,
  sendDispensing as sendPrescriptionDispensing,
} from "../../data/prescriptions";
import { Trans, useTranslation } from "react-i18next";
import Alert from "@material-ui/lab/Alert";
import { useUser } from "../../contexts/User";
import { useHistory, useParams } from "react-router-dom";
import UploadIcon from "../../svgs/upload";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

export default () => {
  const [prescriptionFile, setPrescriptionFile] = useState(null);
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
      reader.onload = (e) => resolve(sha256(e.target.result));
      reader.onerror = (error) => reject(error);
    });

  const onUploadPrescription = async (files) => {
    setLoading(true);
    setPrescriptionFile(files[0]);
    const hash = await toSha256(files[0]);
    history.push(`/${hash}`);
    setLoading(false);
  };

  const getPrecription = async (hash) => {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await fetchPrescriptionResume(hash);
      data.isExpired = new Date() > new Date(data.prescription.expirationDate);
      data.noUseLeft = data.prescription.usesCount >= data.prescription.maxUses;
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
    setLoading(false);
  };

  const sendDispensa = async (e) => {
    e.preventDefault();
    const data = {
      pharmacist: {
        documentId: user.documentId,
        companyId: user.companyId,
        name: user.name,
        pharmacyName: user.pharmacyName,
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

  const onReturn = () => {
    history.replace(`/`);
    history.go(`/`);
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
      padding: theme.spacing(2),
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
      color: "#02BDC4",
      background: "#fff",
    },
    alerts: {
      marginBottom: theme.spacing(2),
    },
    loggedContainer: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    },
    backButton: {
      textDecoration: "underline",
      paddingLeft: 0,
    },
    backButtonContainer: {
      paddingBottom: theme.spacing(2),
    },
    gridTitle: {
      borderBottomColor: "#02BDC4",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(4),
    },
    label: {
      fontWeight: "bold",
      paddingBottom: theme.spacing(1),
    },
    value: {
      wordBreak: "break-all",
    },
    alignRightContent: {
      textAlign: "left",
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
    loggedContainer,
    backButton,
    backButtonContainer,
    gridTitle,
    label,
    value,
    alignRightContent,
  } = useStyles();

  useEffect(() => {
    if (pathHash && pathHash != "") {
      getPrecription(pathHash);
    }
  }, [pathHash]);

  return (
    <section>
      {!prescriptionData && (
        <Container maxWidth="sm" className={loggedContainer}>
          <div style={{ paddingBottom: "2rem" }}>
            <div style={{ paddingBottom: "2rem" }}>
              <Typography variant="h5">{t("pharmacistLogged")}</Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                className={label}
                style={{ fontWeight: "bold" }}
              >
                {user.name}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                className={label}
                style={{ fontWeight: "bold" }}
              >
                {user.documentId}
              </Typography>
            </div>
          </div>
          <UploadInput
            multiple={false}
            onChange={onUploadPrescription}
            containerStyle={{
              display: "flex",
              width: "100%",
              alingContent: "center",
              justifyContent: "center",
              paddingBottom: "1rem",
            }}
            label={
              prescriptionFile ? prescriptionFile.name : t("checkPrescription")
            }
            buttonProps={{
              size: "large",
              style: {
                width: "383px",
                height: "69px",
              },
            }}
            inputProps={{
              id: "prescriptionFile",
              name: "prescriptionFile",
              accept: ".pdf",
            }}
          />
          {pathHash && <div>{pathHash}</div>}
          <UploadIcon style={{ paddingTop: "3rem" }} />
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
        </Container>
      )}
      {prescriptionData && (
        <Container maxWidth="md" className={solidContainer}>
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
          <div className={backButtonContainer}>
            <Button
              color="black"
              className={backButton}
              onClick={(e) => onReturn()}
            >
              Back
            </Button>
          </div>
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

          <div className={gridTitle}>
            <Typography variant="subtitle1">Doctor's information</Typography>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" className={label}>
                {t("doctorName")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.doctor.name}
              </Typography>
            </Grid>
            <Grid item xs={6} className={alignRightContent}>
              <Typography variant="body2" className={label}>
                {t("doctorDocumentId")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.doctor.documentId}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Typography variant="body2" className={label}>
                {t("doctorEmail")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.doctor.email}
              </Typography>
            </Grid>
            <Grid item md={6} xs={12} className={alignRightContent}>
              <Typography variant="body2" className={label}>
                {t("doctorCompanyId")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.doctor.companyId}
              </Typography>
            </Grid>
          </Grid>

          <div className={gridTitle}>
            <Typography variant="subtitle1">Patient’s information</Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" className={label}>
                {t("patientName")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.patient.name}
              </Typography>
            </Grid>
            <Grid item xs={6} className={alignRightContent}>
              <Typography variant="body2" className={label}>
                {t("patientDocumentId")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.patient.documentId}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" className={label}>
                {t("patientEmail")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.patient.email}
              </Typography>
            </Grid>
          </Grid>

          <div className={gridTitle}>
            <Typography variant="subtitle1">Medication information</Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" className={label}>
                {t("maxUses")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.prescription.maxUses}
              </Typography>
            </Grid>
            <Grid item xs={6} className={alignRightContent}>
              <Typography variant="body2" className={label}>
                {t("usesCount")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.prescription.usesCount}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" className={label}>
                {t("lastUseAt")}
              </Typography>
              <Typography variant="body1" className={value}>
                {getFormattedDate(prescriptionData.prescription.lastUseAt) ||
                  t("neverUsed")}
              </Typography>
            </Grid>
            <Grid item xs={6} className={alignRightContent}>
              <Typography variant="body2" className={label}>
                {t("createdAt")}
              </Typography>
              <Typography variant="body1" className={value}>
                {getFormattedDate(prescriptionData.prescription.createdAt)}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6} className={alignRightContent}>
              <Typography variant="body2" className={label}>
                {t("expiredAt")}
              </Typography>
              <Typography variant="body1" className={value}>
                {getFormattedDate(prescriptionData.prescription.expirationDate)}
              </Typography>
            </Grid>
            {prescriptionData.prescription.invalidAt && (
              <Grid item xs={6}>
                <Typography variant="body2" className={label}>
                  {t("invalidAt")}
                </Typography>
                <Typography variant="body1" className={value}>
                  {getFormattedDate(prescriptionData.prescription.invalidAt)}
                </Typography>
              </Grid>
            )}
          </Grid>

          <div className={gridTitle}>
            <Button
              color="primary"
              aria-label="add to shopping cart"
              style={{ padding: "10px 0" }}
            >
              <VerifiedUserIcon style={{ marginRight: 10 }} />
              {"  "} Digital Signature Verified
            </Button>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" className={label}>
                {t("doctorBlockchainId")}
              </Typography>
              <Typography variant="body1" className={value}>
                {prescriptionData.doctor.blockchainid}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" className={label}>
                {t("signature")}
              </Typography>
              <Typography
                variant="body1"
                className={value}
                style={{ wordBreak: "break-all" }}
              >
                {prescriptionData.block.signature}
              </Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" className={label}>
                {t("message")}{" "}
              </Typography>
              <Typography
                variant="body1"
                className={value}
                style={{ wordBreak: "break-all" }}
              >
                {prescriptionData.block.message}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            className={button}
            disabled={
              !isDispensable || prescriptionDispensingStatus == "success"
            }
            onClick={() => setModalOpen(true)}
          >
            {t("dispense")}
          </Button>
          {prescriptionDispensingStatus == "success" && (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Typography variant="subtitle1">Done!</Typography>
            </div>
          )}
          {modalOpen && (
            <Dialog
              open={modalOpen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className={modalTitle} id="alert-dialog-title">
                {t("insertPurchaserId")}
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
                    {t("submit")}
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
