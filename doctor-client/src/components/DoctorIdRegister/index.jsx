import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Trans, useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import FormHelperText from "@material-ui/core/FormHelperText";
import { validateDoctorId } from "../../data/doctors";
import { setDoctorId } from "../../helpers/storage";

export default ({ open, onCancel, onValidate }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, errors } = useForm();

  const validateDoctorDoctorId = async ({ doctorId }) => {
    try {
      const response = await validateDoctorId(doctorId);
      if (response.data.isValid) {
        setDoctorId(doctorId);
      }
      if (typeof onValidate === "function") {
        onValidate(response.data.isValid, doctorId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-require-medical-id">
        <DialogTitle id="form-dialog-require-medical-id">
          <Trans i18nKey="doctorIdRegisterTitle">Medical ID</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans>
              Please, fill the field below with your Medical ID. We need it to
              validade your sign up in regulatory organ.
            </Trans>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="doctorId"
            name="doctorId"
            label={t("doctorId")}
            type="text"
            fullWidth
            inputRef={register({ required: true })}
            error={Boolean(errors.doctorId)}
            required
          />
          {errors.doctorId && (
            <FormHelperText error={true}>
              <Trans>Field is required</Trans>
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            <Trans i18nKey="cancelButtonLabel">Cancel</Trans>
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleSubmit(validateDoctorDoctorId)}
          >
            <Trans i18nKey="submitButtonLabel">Submit</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
