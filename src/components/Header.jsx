const Header = () => {
  return (
    <div className="bg-dark-subtle border-bottom border-dark d-flex justify-content-between align-items-center shadow bg-body-tertiary ">
      <h2 className="px-3 py-2">
        MailBox Client
      </h2>

      <div className="">
        <button
          className=" btn btn-light px-2 py-1 mx-2 rounded "
          onClick={() => {
            localStorage.removeItem("token");
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
