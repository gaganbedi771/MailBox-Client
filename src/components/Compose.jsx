import React, { useState } from "react";
import ComposeHeader from "./UI/ComposeHeader";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import AuthContext from "../store/authContext";
import { useContext } from "react";
import { VITE_DB_URL } from "../../config";

const Compose = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const authCtx = useContext(AuthContext);

  

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(to, subject, body);
    async function sendEmail() {
      try {
        const response = await fetch(`${VITE_DB_URL}/emails.json`, {
          method: "POST",
          body: JSON.stringify({
            to: to,
            from: authCtx.userEmail,
            subject: subject,
            body: body,
            sentAt: new Date().toISOString(),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to send email");
        }
        setTo("");
        setSubject("");
        setBody("");
        alert("Email sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
    sendEmail();
  };

  return (
    <form onSubmit={submitHandler}>
      <ComposeHeader></ComposeHeader>
      <div className="p-2">
        <input
          required
          placeholder="Enter recipient"
          type="email"
          className="form-control mb-2 "
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <input
          required
          placeholder="Enter subject"
          className="form-control"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <SimpleEditor onChange={setBody} value={body} />

      <div className="d-flex justify-content-center p-2 ">
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </div>
    </form>
  );
};

export default Compose;
