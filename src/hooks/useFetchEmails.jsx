import React, { useEffect, useState, useContext } from "react";

import { VITE_DB_URL } from "../../config";
import AuthContext from "../store/authContext";
import AppContext from "../store/appContext";

const useFetchEmails = () => {
  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);
  const {
    activeMenu,
    changeActiveMenu,
    emails,
    setEmails,
    totalUnreadEmails,
    setTotalUnreadEmails,
  } = appCtx;

  useEffect(() => {
    async function fetchEmails() {
      try {
        let response;
        console.log(
          `${VITE_DB_URL}/emails.json?orderBy="to"&equalTo="${authCtx.userEmail}"`,
        );
        if (activeMenu === "inbox") {
          response = await fetch(
            `${VITE_DB_URL}/emails.json?orderBy="to"&equalTo="${authCtx.userEmail}"`,
          );
        } else if (activeMenu === "sent") {
          console.log("sent wala");
          response = await fetch(
            `${VITE_DB_URL}/emails.json?orderBy="from"&equalTo="${authCtx.userEmail}"`,
          );
        }

        let unreadEmails = 0;
        const data = await response.json();
        if (!data) {
          setEmails([]);
          return;
        }
        const inboxEmails = Object.entries(data)
          .map(([id, email]) => ({
            id,
            ...email,
          }))
          .filter((email) => !email.receiverDeleted)
          .map((email) => {
            if (!email.read && activeMenu === "inbox") {
              unreadEmails++;
            }
            return {
              ...email,
              formattedDate: new Date(email.sentAt).toLocaleString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            };
          });
        console.log({
          activeMenu: activeMenu,
          userEmail: authCtx.userEmail,
        });
        setEmails(inboxEmails);
        if (activeMenu === "inbox") {
          setTotalUnreadEmails(unreadEmails);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    }
    fetchEmails();
    const timer = setInterval(() => {
      fetchEmails();
    }, 5000);

    return () => clearInterval(timer);
  }, [activeMenu, authCtx.userEmail]);
};

export default useFetchEmails;
