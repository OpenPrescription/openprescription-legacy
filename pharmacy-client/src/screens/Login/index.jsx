import React, { useState, useEffect } from "react";
import { USER_STORAGE_KEY } from "../../constants";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// JAVASCRIPT
// -------------------------------------------------------------------

export default () => {
  const [documentId, setDocumentId] = useState('');
  const [companyId, setCompanyId] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    const data = JSON.stringify({ documentId, companyId });
    window.localStorage.setItem(USER_STORAGE_KEY, data);
  }

  const useStyles = makeStyles((theme) => ({
    container: {
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '120px',
      backgroundColor: theme.palette.background.paper,
    },
    icon: {
      display: 'block',
      margin: '0 auto 20px',
    },
    input: {
      marginBottom: '20px'
    },
    button: {
      display: 'block',
      margin: '30px auto 0',
      width: '100%'
    }
  }));

  const { container, icon, input, button } = useStyles();

  return (
    <section>
      <form onSubmit={e => onSubmit(e)}>
        <Container maxWidth="sm" className={container}>
          <LockOutlinedIcon fontSize="large" className={icon} />
          <TextField
            autoFocus
            margin="dense"
            id="documentId"
            name="documentId"
            label="Document ID"
            type="text"
            fullWidth
            required
            onChange={e => setDocumentId(e.target.value)}
            value={documentId}
            className={input}
          />
          <TextField
            margin="dense"
            id="companyId"
            name="companyId"
            label="Company ID"
            type="text"
            fullWidth
            required
            onChange={e => setCompanyId(e.target.value)}
            value={companyId}
          />
          <Button type="submit" variant="contained" color="primary" className={button}>Submit</Button>
        </Container>
      </form>
    </section>
  );
};