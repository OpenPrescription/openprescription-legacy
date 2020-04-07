import React from "react";
import AppBar from "@material-ui/core/AppBar";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <header >
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start"  className={classes.menuButton} color="inherit" aria-label="menu">
            <DashboardIcon className={classes.icon} />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Open Prescription
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};
