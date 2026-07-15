import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { VITE_DB_URL } from "../../../config";
import ComposeHeader from "./ComposeHeader";

const ViewEmail = ({}) => {
  const { id } = useParams();
  const [email, setEmail] = React.useState(null);

  useEffect(() => {
    async function fetchEmail() {
      try {
        await fetch(`${VITE_DB_URL}/emails/${id}.json`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            read: true,
          }),
        });

        const response = await fetch(`${VITE_DB_URL}/emails/${id}.json`);
        let data = await response.json();
        data = {
          ...data,
          formattedDate: new Date(data.sentAt).toLocaleString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        };
        setEmail(data);
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    }
    fetchEmail();
  }, [id]);

  return (
    <div>
      {!email ? (
        <p>Loading email...</p>
      ) : (
        <>
          <ComposeHeader></ComposeHeader>
          <div className="container mt-3">
            <h2>Subject: {email.subject}</h2>
            <p>From: {email.from}</p>
            <p>Sent at: {email.formattedDate}</p>
            <div
              className="border-top my-3 p-5 email-body"
              dangerouslySetInnerHTML={{ __html: email.body }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewEmail;
