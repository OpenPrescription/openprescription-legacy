import React from "react";
import { useUser } from "../../contexts/User";
import Header from "../../components/Header";
import GuestHeader from "../../components/GuestHeader";

export default ({ children }) => {
  const user = useUser();
  return (
    <div className="op-container">
      {user ? <Header /> : <GuestHeader />}
      <main>{children}</main>
    </div>
  );
};
