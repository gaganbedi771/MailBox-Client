import { createContext } from "react";
import { useState } from "react";

const AppContext = createContext({
  activeMenu: "inbox",
  changeActiveMenu: () => {},
  emails:[],
  setEmails:()=>{},
  totalUnreadEmails:0,
  setTotalUnreadEmails:()=>{},
});

export const AppContextProvider = (props) => {
  const [activeMenu, setActiveMenu] = useState("inbox");
    const [emails, setEmails] = useState([]);
    const [totalUnreadEmails, setTotalUnreadEmails] = useState(0);

  const changeActiveMenu = (menu) => {
    setActiveMenu(menu);
  };


  const contextValue = {
    activeMenu,
    changeActiveMenu,
    emails,
    setEmails,
    totalUnreadEmails,
    setTotalUnreadEmails,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
