import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VITE_DB_URL } from "../../config";
import AuthContext from "../store/authContext";

const Home = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchEmails() {
      try {
        let response;
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
          .map((email) => ({
            ...email,
            formattedDate: new Date(email.sentAt).toLocaleString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          }));
        setEmails(inboxEmails);
        console.log(inboxEmails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    }
    fetchEmails();
  }, [activeMenu]);

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* head and compose */}
      <div className="d-flex justify-content-center align-items-center mt-2">
        <h3 className="border-bottom"> Welcome to mail client</h3>
        <button
          className="btn btn-info position-fixed bottom-0 end-0 m-3"
          onClick={() => {
            navigate("/compose");
          }}
        >
          Compose
        </button>
      </div>

      {/* main div */}
      <div className="d-flex  flex-grow-1 gap-3 border border-dark rounded-3 ">
        {/* sidebar */}
        <div className="d-flex flex-column border ">
          <button
            className={`mx-3 btn border-bottom fw-bold ${
              activeMenu === "inbox"
                ? "btn-dark text-white fst-italic "
                : "bg-light"
            }`}
            onClick={() => setActiveMenu("inbox")}
          >
            Inbox
          </button>
          <button
            className={`mx-3 btn border-bottom fw-bold ${
              activeMenu === "sent"
                ? "btn-dark text-white fst-italic "
                : "bg-light"
            }`}
            onClick={() => setActiveMenu("sent")}
          >
            Sent
          </button>
        </div>

        {/* email div */}
        <div className="bg-light flex-grow-1 overflow-auto">
          {emails.length === 0 ? (
            <p className="text-center mt-5">No emails to display</p>
          ) : (
            emails.map((email) => (
              <div key={email.id} className="border-bottom p-3 bg-secondary text-white">
                <h5>{email.subject}</h5>
                <p>
                  {email.from} sent at {email.formattedDate}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
