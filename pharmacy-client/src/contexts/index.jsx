import React from "react";
import { AuthProvider } from "./Auth";
import { UserProvider } from "./User";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#02BDC4",
      contrastText: "#FFF",
    },
  },
  typography: {
    h5: {
      color: "#02BDC4",
      fontWeight: "bold"
    },
    subtitle1: {
      color: "#02BDC4",
      fontWeight: "bold"
    }
  },
});

function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default AppProviders;
