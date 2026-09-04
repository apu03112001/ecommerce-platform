import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import SalesPersonDashboard from "./pages/SalesPersonDashboard";

function App() {
  return (
    <>
      <Navbar />

      <main
        className="container"
        style={{
          padding: "30px 0",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/sales-person"
            element={<SalesPersonDashboard />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;