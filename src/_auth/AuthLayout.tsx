import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const userAuthenticated = false;

  return (
    <>
      {userAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
        </>
      )}

      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div style={{ marginBottom: "10px" }}>
          {" "}
          {/* Add margin to shift the logo from the exact center */}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
