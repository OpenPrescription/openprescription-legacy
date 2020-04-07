import React, { useState } from "react";
import FullPageSpinner from "../../components/FullPageSpinner";
const AuthContext = React.createContext();

function AuthProvider(props) {
  const [data, setData] = useState({
    user: true
  });

  if (false) {
    return <FullPageSpinner />;
  }
  const login = loginData => {}; // make a login request
  const register = userData => {}; // register the user
  const logout = () => {}; // clear the token in localStorage and the user data

  return (
    <AuthContext.Provider
      value={{ data, login, logout, register }}
      {...props}
    />
  );
}
const useAuth = () => React.useContext(AuthContext);
export { AuthProvider, useAuth };
