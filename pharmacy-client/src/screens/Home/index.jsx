import React, { useState } from "react";
import { useForm } from "react-hook-form";
import sha256 from "crypto-js/sha256";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import UploadInput from './../../components/UploadInput';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const [selectExpiredDate, handleExpiredDateChange] = useState(new Date());
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyerDocumentId, setBuyerDocumentId] = useState('');

  const onUploadPrescription = (files) => {
    setPrescriptionFile(files[0]);
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const hash = sha256(reader.getAsOriginalMyString());
        setHash(hash.toString());
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsOriginalMy(files[0]);
  };

  const handleFormSubmit = async (data) => {
    data.hash = hash;
    data.expirationDate = selectExpiredDate;
    data.prescriptionFile = prescriptionFile;
    axios.post('http://www.mocky.io/v2/5e8c92232f0000132288cd08', {...data})
      .then(function ({ data }) {
        setDoctorData(data);
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sendDispensa = e => {
    e.preventDefault();
    const userData = JSON.parse(window.localStorage.getItem('USER_DATA'));
    const data = { ...userData, hash, buyerDocumentId };
    console.log(data);

    console.log('---------------------');
    console.log('SUCCESS');
    console.log('---------------------');
    setDoctorData(null)
    setModalOpen(false);
    setHash(null);
    setPrescriptionFile(null);
    setBuyerDocumentId('');
  }

  const getFormattedDate = date => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const useStyles = makeStyles((theme) => ({
    whiteContainer: {
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '120px',
      backgroundColor: theme.palette.background.paper,
    },
    solidContainer: {
      paddingTop: '60px'
    },
    input: {
      marginBottom: '20px'
    },
    button: {
      display: 'block',
      margin: '30px auto 0',
      width: '100%'
    },
    divider: {
      margin: '20px 0'
    },
    modalContent: {
      padding: '10px 30px 30px'
    },
    modalTitle: {
      padding: '30px 30px 0'
    }
  }));

  const { whiteContainer, solidContainer, input, button, divider, modalContent, modalTitle } = useStyles();

  return (
    <section>
      {!doctorData && (
        <Container maxWidth="sm" className={whiteContainer}>
          <form noValidate onSubmit={handleSubmit(handleFormSubmit)} style={{ textAlign: 'center' }}>
            <UploadInput
              multiple={false}
              onChange={onUploadPrescription}
              label={prescriptionFile ? prescriptionFile.name : 'Click here to upload your file'}
              inputProps={{
                id: "prescriptionFile",
                name: "prescriptionFile",
                accept: ".pdf",
              }}
            />
            <Button type="submit" variant="contained" color="secondary" className={button}>Submit</Button>
          </form>
        </Container>
      )}
      {doctorData && (
        <Container maxWidth="sm" className={solidContainer}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Doctor Name</Typography>
              <Typography variant="body1">{doctorData.doctorName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Doctor Document ID</Typography>
              <Typography variant="body1">{doctorData.doctorDocumentId}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Doctor Blockchain ID</Typography>
              <Typography variant="body1">{doctorData.doctorBlockchainId}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Doctor E-mail</Typography>
              <Typography variant="body1">{doctorData.doctorEmail}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Doctor Company ID</Typography>
              <Typography variant="body1">{doctorData.doctorCompanyId}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Patient Name</Typography>
              <Typography variant="body1">{doctorData.patientName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Patient Document ID</Typography>
              <Typography variant="body1">{doctorData.patientDocumentId}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Patient E-mail</Typography>
              <Typography variant="body1">{doctorData.patientEmail}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Max Uses</Typography>
              <Typography variant="body1">{doctorData.maxUses}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Uses Count</Typography>
              <Typography variant="body1">{doctorData.usesCount}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">Last Use At</Typography>
              <Typography variant="body1">{getFormattedDate(doctorData.lastUseAt)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Created At</Typography>
              <Typography variant="body1">{getFormattedDate(doctorData.createdAt)}</Typography>
            </Grid>
          </Grid>

          <Divider light className={divider} />

          {doctorData.invalidAt || doctorData.expiredAt && (
            <Grid container spacing={2}>
              {doctorData.invalidAt && (
                <Grid item xs={6}>
                  <Typography variant="body2">Invalid At</Typography>
                  <Typography variant="body1">{getFormattedDate(doctorData.invalidAt)}</Typography>
                </Grid>
              )}
              {doctorData.expiredAt && (
                <Grid item xs={6}>
                  <Typography variant="body2">Expired At</Typography>
                  <Typography variant="body1">{getFormattedDate(doctorData.expiredAt)}</Typography>
                </Grid>
              )}
            </Grid>
          )}

          <Button variant="contained" color="secondary" className={button} onClick={() => setModalOpen(true)}>Dispensa</Button>
          {modalOpen && (
            <Dialog
              open={modalOpen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className={modalTitle} id="alert-dialog-title">Insert buyer document ID to finish</DialogTitle>
              <DialogContent className={modalContent}>
                <form noValidate onSubmit={sendDispensa}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="buyerDocumentId"
                    name="buyerDocumentId"
                    label="Buyer Document ID"
                    type="text"
                    fullWidth
                    required
                    onChange={e => setBuyerDocumentId(e.target.value)}
                    value={buyerDocumentId}
                    className={input}
                  />
                  <Button type="submit" variant="contained" color="primary" className={button}>submit</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </Container>
      )}
    </section>
  );
};
