import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
import { useUser } from "../../contexts/User";
import { toBase64 } from "../../helpers";
import sha256 from "js-sha256";
import shippingPackage from "./../../assets/shipping-package.svg";
import { validateDoctorId } from "../../data/doctors";
import { setDoctorId } from "../../helpers/storage";

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
  prescriptionTitle: {
    fontSize: 20,
    color: "#00767A",
    fontWeight: 900,
    textAlign: "center",
    marginBottom: 40,
  },
}));

export default () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [openDoctorIdRequest, toggleDoctorIdRequest] = useState(false);
  const [startSignProcess, handleSignProcess] = useState(false);
  const [prescription, setPrescription] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(false);
  const [creationResponse, setCreationResponse] = useState("");

  const [uploadForm, setUploadForm] = useState(false);
  const user = useUser();

  const onValidateDoctorId = (doctorId) => {
    setPrescription({
      ...prescription,
      doctorId,
    });
    setUploadForm(true);
    toggleDoctorIdRequest(false);
  };

  const sendPrescription = async (data) => {
    try {
      const base64File = await toBase64(data.prescriptionFile[0]);
      data.prescriptionFile = base64File;
      data.company = {
        id: user.companyId,
        name: user.companyName,
      };
      await createPrescription(data);
      window.scrollTo(0, 0);
      setCreationResponse("success");
    } catch (error) {
      window.scrollTo(0, 0);
      setCreationResponse("error");
      console.error(error);
    }
  };

  const validateDoctor = async (doctor) => {
    return validateDoctorId(prescription.doctorId, doctor.name, doctor.country);
  };

  const onPrescriptionSigned = async (doctor) => {
    setLoading(true);
    try {
      await validateDoctor(doctor);
      setDoctorId(prescription.doctorId);
    } catch (err) {
      setCreationResponse("doctor-invalid");
      setLoading(false);
      return;
    }
    const data = {
      ...prescription,
      doctor: JSON.stringify(doctor),
      expirationDate: moment(prescription.expirationDate).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    };
    await sendPrescription(data);
    handleSignProcess(false);
    setLoading(false);
  };

  const onSubmitPrescription = async (data) => {
    const doctorId = getDoctorId();
    data.doctorId = doctorId;
    setPrescription(data);
    if (!doctorId) {
      return toggleDoctorIdRequest(true);
    }
    setUploadForm(true);
    setPrescription(data);
  };

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
    setPrescription({
      ...prescription,
      hash,
      prescriptionFile: files,
    });
    setLoading(false);
  };

  const onClickPrescription = () => {
    handleSignProcess(true);
  };

  return (
    <div className={classes.heroContent}>
      <Container>
        {loading && (
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <div style={{ marginBottom: 20 }}>
          {creationResponse == "error" && (
            <Alert severity="error">
              <Trans i18nKey="prescriptionUnkownErrorMessage">
                Could not create prescription. Please, try later.
              </Trans>
            </Alert>
          )}
          {creationResponse == "doctor-invalid" && (
            <Alert severity="error">
              <Trans i18nKey="doctorInvalidErrorMessage">
                We can validade doctor ID, please contact us.
              </Trans>
            </Alert>
          )}
        </div>
        {!startSignProcess && (
          <>
            {creationResponse === "success" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "600px",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  component="p"
                  className={classes.prescriptionTitle}
                >
                  <Trans i18nKey="prescriptionSent">
                    Thank you, your prescription was sent!
                  </Trans>
                </Typography>
                <img src={shippingPackage} />
              </div>
            )}
            {creationResponse === "" && (
              <PrescriptionForm
                file={prescriptionFile}
                onClickPrescription={onClickPrescription}
                onSubmit={onSubmitPrescription}
                uploadForm={uploadForm}
                onUploadPrescription={onUploadPrescription}
              />
            )}
            <DoctorIdRegisterDialog
              open={openDoctorIdRequest}
              onCancel={() => toggleDoctorIdRequest(false)}
              onSubmit={onValidateDoctorId}
            />
          </>
        )}
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
