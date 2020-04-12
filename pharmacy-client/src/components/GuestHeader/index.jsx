import React from "react";
import AppBar from "@material-ui/core/AppBar";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import logo from "../../assets/logo.svg";

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
    <header>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <img src={logo} />
        </Toolbar>
      </AppBar>
    </header>
  );
};
