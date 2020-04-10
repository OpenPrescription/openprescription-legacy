import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Trans, useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import UploadInput from "../../components/UploadInput";
import { DatePicker } from "@material-ui/pickers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import FormHelperText from "@material-ui/core/FormHelperText";
import sha256 from "js-sha256";

const useStyles = makeStyles((theme) => ({
  formContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 6),
  },
  prescriptionInput: {
    display: "none",
  },
  prescriptionLabel: {
    padding: theme.spacing(0, 0, 2, 0),
  },
  formControl: {
    margin: theme.spacing(0, 0, 2, 0),
    display: "block",
    "& input": {
      width: 350,
    },
  },
}));

export default ({ onSubmit }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { register, handleSubmit, watch, errors } = useForm();
  const [selectExpiredDate, handleExpiredDateChange] = useState(new Date());
  const [privatePrescription, handlePrivateChange] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [hash, setHash] = useState(null);

  const onUploadPrescription = (files) => {};

  const handleFormSubmit = (data) => {
    data.expirationDate = selectExpiredDate;
    if (typeof onSubmit === "function") onSubmit(data);
  };

  return (
    <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={classes.formContent}>
        <FormControl className={classes.formControl}>
          <Typography
            variant="body2"
            component="p"
            className={classes.prescriptionLabel}
          >
            <Trans i18nKey="sendPrescriptionFileLabel">
              Send the prescription in PDF file
            </Trans>
          </Typography>
          <UploadInput
            multiple={false}
            onChange={onUploadPrescription}
            label={
              !prescriptionFile
                ? t("uploadPrescription")
                : prescriptionFile.name
            }
            inputProps={{
              id: "prescriptionFile",
              name: "prescriptionFile",
              accept: ".pdf",
              ref: register({ required: true }),
            }}
          />
          {errors.prescriptionFile && (
            <FormHelperText error={Boolean(errors.prescriptionFile)}>
              <Trans i18nKey="patientPrescriptionFieldRequiredError">
                Prescription file is required
              </Trans>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            required
            id="patientName"
            name="patientName"
            label={t("patientNameLabel")}
            autoComplete="pname"
            inputRef={register({ required: true })}
            error={Boolean(errors.patientName)}
          />
          {errors.patientName && (
            <FormHelperText error={true}>
              <Trans i18nKey="patientNameFieldRequiredError">
                Patient name is required
              </Trans>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            required
            id="patientEmail"
            name="patientEmail"
            label={t("patientEmailLabel")}
            autoComplete="pemail"
            inputRef={register({
              required: true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            error={Boolean(errors.patientEmail)}
          />
          {errors.patientEmail && errors.patientEmail.type === "required" && (
            <FormHelperText error={true}>
              <Trans i18nKey="patientEmailFieldRequiredError">
                Patient e-mail is required
              </Trans>
            </FormHelperText>
          )}
          {errors.patientEmail && errors.patientEmail.type === "pattern" && (
            <FormHelperText error={true}>
              <Trans i18nKey="patientEmailFieldInvalidError">
                Patient e-mail is invalid
              </Trans>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            required
            id="patientId"
            name="patientId"
            label={t("patientIDLabel")}
            autoComplete="pdocumentid"
            inputRef={register({ required: true })}
            error={Boolean(errors.patientId)}
          />
          {errors.patientId && (
            <FormHelperText error={true}>
              <Trans i18nKey="patientDocumentIdFieldRequiredError">
                Patient document ID is required
              </Trans>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            required
            id="doctorCompanyId"
            name="doctorCompanyId"
            label={t("doctorCompanyIDLabel")}
            autoComplete="dccompanyid"
            inputRef={register({ required: true })}
            error={Boolean(errors.doctorCompanyId)}
          />
          {errors.patientId && (
            <FormHelperText error={true}>
              <Trans i18nKey="doctorCompanyFieldRequiredError">
                Doctor Company ID is required
              </Trans>
            </FormHelperText>
          )}
          <FormHelperText>
            <Trans i18nKey="doctorCompanyIDHelper">
              Doctor Company ID is required
            </Trans>
          </FormHelperText>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            required
            id="maxUses"
            name="maxUses"
            label={t("maxUsesLabel")}
            autoComplete="pdocumentid"
            type="number"
            defaultValue={1}
            inputProps={{ min: 1 }}
            inputRef={register({ required: true })}
            error={Boolean(errors.maxUses)}
          />
          {errors.maxUses && (
            <FormHelperText error={true}>
              <Trans>Max uses is required</Trans>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl className={classes.formControl}>
          <Typography variant="body2" component="p">
            <Trans i18nKey="expirationDateLabel">
              Prescription expiration date
            </Trans>
          </Typography>
          <DatePicker
            value={selectExpiredDate}
            onChange={handleExpiredDateChange}
            format="DD/MM/YYYY"
            minDate={new Date()}
          />
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormControlLabel
            control={
              <Checkbox
                checked={privatePrescription}
                onChange={(event) =>
                  handlePrivateChange(event.currentTarget.checked)
                }
                name="isPrivate"
                color="primary"
                inputProps={{
                  ref: register,
                }}
              />
            }
            label={t("privatePrescriptionLabel")}
          />
          <FormHelperText>
            <Trans i18nKey="privateCheckboxHelper">
              If checked only patient can use this prescription to buy medicines
            </Trans>
          </FormHelperText>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <Button type="submit" variant="contained" color="primary">
            <Trans i18nKey="submitButtonLabel">Submit</Trans>
          </Button>
        </FormControl>
      </div>
    </form>
  );
};
