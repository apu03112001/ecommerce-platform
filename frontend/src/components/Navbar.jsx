import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        background: "#1E40AF",
        color: "white",
        padding: "16px 40px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 12px rgba(0,0,0,.15)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          LabuShop
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontWeight: "500",
            flexWrap: "wrap",
          }}
        >
          <Link to="/">Home</Link>

          <Link to="/cart">Cart</Link>

          <Link to="/wishlist">Wishlist</Link>

          {user ? (
            <>
              <span>Hello, {user.name}</span>

              {user.role === "admin" && (
                <Link to="/admin">Admin</Link>
              )}

              {user.role === "sales_person" && (
                <Link to="/sales-person">
                  Sales Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                style={{
                  background: "white",
                  color: "#1E40AF",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link
                to="/register"
                style={{
                  background: "white",
                  color: "#1E40AF",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;