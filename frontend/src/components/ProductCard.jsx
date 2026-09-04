import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Added to cart ✔");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const addToWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/wishlist",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Added to wishlist ❤");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: ".3s",
      }}
    >
      {/* IMAGE */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        style={{
          cursor: "pointer",
          background: "#E2E8F0",
          height: "220px",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span>Product Image</span>
        )}
      </div>

      <div style={{ marginTop: "18px" }}>
        <span
          style={{
            background: "#DBEAFE",
            color: "#2563EB",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {product.category}
        </span>

        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          style={{
            marginTop: "12px",
            cursor: "pointer",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            color: "#64748B",
            margin: "10px 0",
            minHeight: "40px",
          }}
        >
          {product.description}
        </p>

        <h2 style={{ color: "#2563EB" }}>
          ₹ {product.price}
        </h2>

        <p style={{ margin: "12px 0" }}>
          Stock: {product.stock}
        </p>

        {message && (
          <div
            style={{
              background: "#DCFCE7",
              color: "#15803D",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={addToCart}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Add to Cart
        </button>

        <button
          onClick={addToWishlist}
          style={{
            width: "100%",
            padding: "12px",
            background: "white",
            color: "#2563EB",
            border: "2px solid #2563EB",
            borderRadius: "10px",
            fontWeight: "600",
          }}
        >
          Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;