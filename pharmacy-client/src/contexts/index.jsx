import React from "react";
import { AuthProvider } from "./Auth";
import { UserProvider } from "./User";
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}
export default AppProviders;
