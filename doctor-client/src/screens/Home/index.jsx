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

  const sendPrescription = async (data) => {
    const prescriptionFormData = new FormData();
    for (const name in data) {
      const value = data[name];
      prescriptionFormData.append(name, value);
    }
    try {
      const response = await createPrescription(prescriptionFormData);
    } catch (error) {
      console.error(error);
    }
  };

  const onPrescriptionSigned = async (user) => {
    handleSignProcess(false);
    setLoading(true);
    const data = {
      ...prescription,
      doctor: user,
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

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className={classes.heroContent}>
      <Container>
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
