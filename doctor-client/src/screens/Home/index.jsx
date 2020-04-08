import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Trans, useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import DoctorIdRegisterDialog from "../../components/DoctorIdRegister";
import { getDoctorId } from "../../helpers/storage";
import SignPrescription from "../../components/SignPrescription";
import PrescriptionForm from "../../components/PrescriptionForm";
import { createPrescription } from "../../data/prescriptions";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [openDoctorIdRequest, toggleDoctorIdRequest] = useState(false);
  const [startSignProcess, handleSignProcess] = useState(false);
  const [prescription, setPrescription] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [creationResponse, setCreationResponse] = useState(false);

  const onValidateDoctorId = (isValid, doctorId) => {
    if (isValid) {
      setPrescription({
        ...prescription,
        doctorId: doctorId,
      });
      return handleSignProcess(true);
    } else {
      setValidationError(t("doctorIdvalidationError"));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const sendPrescription = async (data) => {
    try {
      data.prescriptionFile = await toBase64(data.prescriptionFile[0]);
      await createPrescription(data);
      window.scrollTo(0, 0);
      setCreationResponse("success");
    } catch (error) {
      window.scrollTo(0, 0);
      setCreationResponse("error");
      console.error(error);
    }
  };

  const onPrescriptionSigned = async (doctor) => {
    handleSignProcess(false);
    setLoading(true);
    const data = {
      ...prescription,
      doctor: JSON.stringify(doctor),
      expirationDate: moment(prescription.expirationDate).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    };
    await sendPrescription(data);
    setLoading(false);
  };

  const onSubmitPrescription = async (data) => {
    const doctorId = getDoctorId();
    data.doctorId = doctorId;
    setPrescription(data);
    if (!doctorId) {
      return toggleDoctorIdRequest(true);
    }
    setPrescription(data);
    handleSignProcess(true);
  };

  return (
    <div className={classes.heroContent}>
      {loading && (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Container>
        {creationResponse == "success" && (
          <Alert severity="success">
            <Trans i18nKey="prescriptionSuccessMessage">
              Prescription created with success. A e-mail was sent to patient
              with prescription document.
            </Trans>
          </Alert>
        )}
        {creationResponse == "error" && (
          <Alert severity="error">
            <Trans i18nKey="prescriptionUnkownErrorMessage">
              Could not create prescription. Please, try later.
            </Trans>
          </Alert>
        )}
        <Typography variant="h4" component="h2">
          <Trans i18nKey="helloDoctor">Hello, Doctor</Trans>
        </Typography>
        <Typography variant="body2" component="p">
          <Trans i18nKey="fillToCreateNewPrescription">
            Fill fields bellow to create a new medical prescription:
          </Trans>
        </Typography>
        {Boolean(validationError) && (
          <Alert severity="error">{validationError}</Alert>
        )}
        <PrescriptionForm onSubmit={onSubmitPrescription} />
        <DoctorIdRegisterDialog
          open={openDoctorIdRequest}
          onCancel={() => toggleDoctorIdRequest(false)}
          onValidate={onValidateDoctorId}
        />
        {startSignProcess && (
          <SignPrescription
            prescription={prescription}
            onSigned={onPrescriptionSigned}
          />
        )}
      </Container>
    </div>
  );
};
