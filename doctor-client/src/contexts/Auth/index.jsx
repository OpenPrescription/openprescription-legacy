import React, { createContext } from "react";
import { USER_STORAGE_KEY } from "../../constants";
import { useStateWithLocalStorage } from "../../helpers";

const AuthContext = createContext();

function AuthProvider(props) {
  const [user, setUser] = useStateWithLocalStorage(USER_STORAGE_KEY);

  const login = (data) => setUser(data); // make a login request

  const register = (userData) => {}; // register the user
  const logout = () => setUser(null); // clear the token in localStorage and the user data

  return (
    <AuthContext.Provider
      value={{ data: { user }, login, logout, register }}
      {...props}
    />
  );
}
const useAuth = () => React.useContext(AuthContext);
export { AuthProvider, useAuth };