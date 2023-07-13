import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [User, setUser] = useState({});
  const [MobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{ User, setUser, MobileNavOpen, setMobileNavOpen }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
