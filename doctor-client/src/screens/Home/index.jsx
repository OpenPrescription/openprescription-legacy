import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import doctor from './../../assets/doctor-man.svg';
import unlock from './../../assets/unlock.svg';

export default () => {

  const { t } = useTranslation();
  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: 52,
      maxWidth: 1100
    },
    title: {
      fontFamily: 'Roboto',
      fontWeight: '900',
      fontSize: '40px',
      lineHeight: '47px',
      color: '#009688',
      maxWidth: 419,
      margin: '0 0 27px'
    },
    text: {
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      fontSize: '20px',
      lineHeight: '23px',
      color: '#444444',
      margin: '0 0 59px',
      maxWidth: 617
    },
    button: {
      fontFamily: 'Roboto',
      fontWeight: '900',
      fontSize: '20px',
      lineHeight: '23px',
      height: 67,
      width: 294,
      boxShadow: 0,
      position: 'relative',
      zIndex: 2
    },
    imageContainer: {
      position: 'relative',
      paddingTop: 104,
      zIndex: 2,

      ['@media (min-width: 768px) and (max-height: 760px)']: {
        paddingTop: 40
      },

      ['@media (min-width: 768px) and (max-height: 600px)']: {
        paddingTop: 20
      },

      ['@media (max-width: 768px)']: {
        paddingTop: 0,
        paddingBottom: 40
      },
    },
    doctorStyle: {
      width: 440,
      height: 640,
      position: 'fixed',
      left: '50%',
      transform: 'translateX(+20%)',
      bottom: 56,

      ['@media (max-height: 760px)']: {
        bottom: -100
      },

      ['@media (max-width: 1000px)']: {
        display: 'none'
      }
    },
    unlockStyle: {
      width: 388,
      height: 355,
      position: 'fixed',
      left: 0,
      bottom: 56,
      zIndex: 1,

      ['@media (max-height: 840px)']: {
        display: 'none'
      }
    },
    footerBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#EEEEEE',
      height: 56,
      zIndex: 3,

      ['@media (max-width: 768px)']: {
        display: 'none'
      }
    }
  }));

  const {
    container,
    title,
    text,
    button,
    imageContainer,
    doctorStyle,
    unlockStyle,
    footerBar
  } = useStyles();

  return (
    <Container className={container}>
      <div className={imageContainer}>
        <Typography variant="h1" className={title}>
          {t('homeScreenTitle')}
        </Typography>
        <Typography variant="body1" className={text}>
          {t('homeScreenText')}
        </Typography>
        <Button type="submit" variant="contained" color="primary" className={button} onClick={() => history.push('/patient-data')}>
          {t('homeScreenButton')}
        </Button>
        <img
          src={doctor}
          class={doctorStyle}
        />
        <img
          src={unlock}
          class={unlockStyle}
        />
      </div>
      <div className={footerBar}></div>
    </Container>
  );
};
