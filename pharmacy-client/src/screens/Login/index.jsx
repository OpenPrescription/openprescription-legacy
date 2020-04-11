import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/Auth";
import { Typography, useMediaQuery } from "@material-ui/core";
import PharmacyLogin from "../../svgs/pharmacy-login";
// JAVASCRIPT
// -------------------------------------------------------------------

export default () => {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const { login } = useAuth();
  const matches = useMediaQuery("(min-width:600px)");

  const onSubmit = ({ documentId, companyId, name, companyName }) => {
    login({ documentId, companyId, name, companyName });
    history.replace(from);
  };

  const useStyles = makeStyles((theme) => ({
    containerLogin: {
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      position: "absolute",
      left: matches ? "25%" : "50%",
      top: "50%",
      transform: matches ? "translate(-25%, -50%)" : "translate(-50%, -50%)",
      padding: "17px 50px 30px 48px",
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

  const { containerLogin, icon, input, button } = useStyles();
  const { register, handleSubmit, watch, errors } = useForm();
  const { t } = useTranslation();

  if (loggedIn) return <Redirect to="/" />;

  return (
    <section>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item md={6} xs={12}>
            <Container maxWidth="sm" className={containerLogin}>
              <Typography variant="subtitle1">
                Fill fields bellow to access the prescription.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label={t("name")}
                type="text"
                fullWidth
                required
                className={input}
                error={Boolean(errors.documentId)}
                inputProps={{
                  ref: register({ required: true }),
                }}
              />
              {errors.documentId && (
                <FormHelperText error={true}>
                  <Trans i18nKey="documentIdRequired">
                    Document ID is required
                  </Trans>
                </FormHelperText>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="documentId"
                name="documentId"
                label={t("documentId")}
                type="text"
                fullWidth
                required
                className={input}
                error={Boolean(errors.documentId)}
                inputProps={{
                  ref: register({ required: true }),
                }}
              />
              {errors.documentId && (
                <FormHelperText error={true}>
                  <Trans i18nKey="documentIdRequired">
                    Document ID is required
                  </Trans>
                </FormHelperText>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="companyName"
                name="companyName"
                label={t("pharmacyName")}
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
                  <Trans i18nKey="companyIdRequired">
                    Company ID is required
                  </Trans>
                </FormHelperText>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={button}
              >
                Submit
              </Button>
            </Container>
          </Grid>
          {matches && (
            <Grid item xs={6}>
              <PharmacyLogin
                style={{ position: "absolute", bottom: 0, display: "block" }}
              />
            </Grid>
          )}
        </Grid>
      </form>
    </section>
  );
};
