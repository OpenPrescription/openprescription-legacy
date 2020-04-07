import React from "react";
import { useUser } from "../../contexts/User";
import Header from "../Header";
import GuestHeader from "../GuestHeader";

export default ({ children }) => {
  const user = useUser();
  return (
    <div className="op-container">
      {user ? <Header /> : <GuestHeader />}
      <main>{children}</main>
    </div>
  );
};
