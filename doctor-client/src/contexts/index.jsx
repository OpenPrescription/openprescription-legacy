import React from "react";
import { AuthProvider } from "./Auth";
import { UserProvider } from "./User";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

function AppProviders({ children }) {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </MuiPickersUtilsProvider>
  );
}
export default AppProviders;
