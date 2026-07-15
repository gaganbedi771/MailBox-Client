import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VITE_DB_URL } from "../../config";
import AuthContext from "../store/authContext";
import AppContext from "../store/appContext";
import useFetchEmails from "@/hooks/useFetchEmails";

const Home = () => {
  const navigate = useNavigate();
  useFetchEmails();
  const appCtx = useContext(AppContext);
  const { activeMenu, changeActiveMenu, emails, setEmails, totalUnreadEmails } =
    appCtx;

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
              activeMenu === "inbox"
                ? "btn-dark text-white fst-italic "
                : "bg-light"
            }`}
            onClick={() => {
              console.log("inbox");
              setEmails([]);
              changeActiveMenu("inbox");
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
              changeActiveMenu("sent");
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
                    {!email.read && activeMenu === "inbox" && (
                      <span className="fw-bold">🟢</span>
                    )}{" "}
                    {email.subject}
                  </h5>
                  <p>
                    {activeMenu === "inbox"
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
