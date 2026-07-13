import { useNavigate } from "react-router-dom";
import AuthContext from "@/store/authContext";
import { useContext } from "react";

const Header = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  return (
    <div className="bg-dark-subtle border-bottom border-dark d-flex justify-content-between align-items-center shadow bg-body-tertiary ">
      <h2 className="px-3 py-2">
        MailBox Client
      </h2>

      <div className="">
        <button
          className=" btn btn-light px-2 py-1 mx-2 rounded "
          onClick={() => {
            authCtx.logoutHandler();

            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
