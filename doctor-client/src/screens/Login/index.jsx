import React, { useState, useEffect } from "react";
import { USER_STORAGE_KEY } from "../../constants";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/Auth";
// JAVASCRIPT
// -------------------------------------------------------------------

export default () => {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const { login } = useAuth();

  const onSubmit = ({ documentId, companyId, name, companyName }) => {
    login({ documentId, companyId, name, companyName });
    history.replace(from);
  };

  const useStyles = makeStyles((theme) => ({
    container: {
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      padding: theme.spacing(3, 3, 3, 3),
      backgroundColor: theme.palette.background.paper,
      maxWidth: 350,
    },
    icon: {
      display: "block",
      margin: "0 auto 20px",
    },
    input: {
      marginBottom: "20px",
    },
    button: {
      display: "block",
      margin: "30px auto 0",
      width: "100%",
    },
  }));

  const { container, icon, input, button } = useStyles();
  const { register, handleSubmit, watch, errors } = useForm();
  const { t } = useTranslation();

  if (loggedIn) return <Redirect to="/" />;

  return (
    <section>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth="sm" className={container}>
          <LockOutlinedIcon fontSize="large" className={icon} />
          <TextField
            autoFocus
            margin="dense"
            id="companyName"
            name="companyName"
            label={t("companyName")}
            type="text"
            fullWidth
            required
            className={input}
            error={Boolean(errors.companyName)}
            inputProps={{
              ref: register({ required: true }),
            }}
          />
          {errors.companyName && (
            <FormHelperText error={true}>
              <Trans i18nKey="companyNameRequired">
                Document ID is required
              </Trans>
            </FormHelperText>
          )}
          <TextField
            margin="dense"
            id="companyId"
            name="companyId"
            label={t("companyId")}
            type="text"
            fullWidth
            required
            error={Boolean(errors.companyId)}
            inputProps={{
              ref: register({ required: true }),
            }}
          />
          {errors.companyId && (
            <FormHelperText error={true}>
              <Trans i18nKey="companyIdRequired">Company ID is required</Trans>
            </FormHelperText>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={button}
          >
            <Trans i18nKey="submitButtonLabel">Submit</Trans>
          </Button>
        </Container>
      </form>
    </section>
  );
};
