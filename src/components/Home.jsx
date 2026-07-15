import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VITE_DB_URL } from "../../config";
import AuthContext from "../store/authContext";
import AppContext from "../store/appContext";

const Home = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [totalUnreadEmails, setTotalUnreadEmails] = useState(0);
  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);

  useEffect(() => {
    async function fetchEmails() {
      try {
        let response;
        console.log(
          `${VITE_DB_URL}/emails.json?orderBy="to"&equalTo="${authCtx.userEmail}"`,
        );
        if (appCtx.activeMenu === "inbox") {
          response = await fetch(
            `${VITE_DB_URL}/emails.json?orderBy="to"&equalTo="${authCtx.userEmail}"`,
          );
        } else if (appCtx.activeMenu === "sent") {
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
            if (!email.read && appCtx.activeMenu === "inbox") {
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
          activeMenu: appCtx.activeMenu,
          userEmail: authCtx.userEmail,
        });
        setEmails(inboxEmails);
        setTotalUnreadEmails(unreadEmails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    }
    fetchEmails();
    const timer = setInterval(() => {
      fetchEmails();
    }, 5000);

    return () => clearInterval(timer);
  }, [appCtx.activeMenu, authCtx.userEmail]);

  const handleDelete = async (emailId) => {
    try {
      const emailToDelete = emails.find((email) => email.id === emailId);
      if (!emailToDelete) return;

      await fetch(`${VITE_DB_URL}/emails/${emailId}.json`, {
        method: "DELETE",
      });

      setEmails(emails.filter((email) => email.id !== emailId));
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  };

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
              appCtx.activeMenu === "inbox"
                ? "btn-dark text-white fst-italic "
                : "bg-light"
            }`}
            onClick={() => {
              console.log("inbox");
              setEmails([]);
              appCtx.changeActiveMenu("inbox");
            }}
          >
            Inbox <span className="badge bg-danger">{totalUnreadEmails}</span>
          </button>
          <button
            className={`mx-3 btn border-bottom fw-bold ${
              appCtx.activeMenu === "sent"
                ? "btn-dark text-white fst-italic "
                : "bg-light"
            }`}
            onClick={() => {
              console.log("sent");
              setEmails([]);
              appCtx.changeActiveMenu("sent");
            }}
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
              <div
                key={email.id}
                className="border-bottom p-3 bg-secondary text-white d-flex justify-content-between border border-dark rounded-3 m-2"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/email/${email.id}`)}
                >
                  <h5>
                    {!email.read && appCtx.activeMenu === "inbox" && (
                      <span className="fw-bold">🟢</span>
                    )}{" "}
                    {email.subject}
                  </h5>
                  <p>
                    {appCtx.activeMenu === "inbox"
                      ? `From: ${email.from}`
                      : `To: ${email.to}`}{" "}
                    sent at {email.formattedDate}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(email.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
