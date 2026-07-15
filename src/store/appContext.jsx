import { createContext } from "react";
import { useState } from "react";

const AppContext = createContext({
  activeMenu: "inbox",
  changeActiveMenu: () => {},
});

export const AppContextProvider = (props) => {
  const [activeMenu, setActiveMenu] = useState("inbox");

  const changeActiveMenu = (menu) => {
    setActiveMenu(menu);
  };

  const contextValue = {
    activeMenu,
    changeActiveMenu,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
