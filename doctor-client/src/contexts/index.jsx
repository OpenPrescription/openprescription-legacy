import React from "react";
import { AuthProvider } from "./Auth";
import { UserProvider } from "./User";
import { theme } from "./Theme";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

function AppProviders({ children }) {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}
export default AppProviders;
