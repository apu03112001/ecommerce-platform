import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Added to Cart ✔");

      setTimeout(() => setMessage(""), 2000);
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

      setMessage("Added to Wishlist ❤");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "35px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
      }}
    >
      {/* IMAGE */}
      <div>
        <div
          style={{
            background: "#E2E8F0",
            height: "450px",
            borderRadius: "20px",
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
            "Product Image"
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              style={{
                width: "70px",
                height: "70px",
                background: "#E2E8F0",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              IMG
            </div>
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div>
        <span
          style={{
            background: "#DBEAFE",
            color: "#2563EB",
            padding: "6px 12px",
            borderRadius: "20px",
            fontWeight: "600",
          }}
        >
          {product.category}
        </span>

        <h1
          style={{
            margin: "20px 0",
            fontSize: "40px",
          }}
        >
          {product.name}
        </h1>

        <p
          style={{
            color: "#64748B",
            lineHeight: "1.8",
          }}
        >
          {product.description}
        </p>

        <h2
          style={{
            color: "#2563EB",
            marginTop: "25px",
            fontSize: "36px",
          }}
        >
          ₹ {product.price}
        </h2>

        <p style={{ marginTop: "12px" }}>
          Stock Available:{" "}
          <strong style={{ color: "#16A34A" }}>
            {product.stock}
          </strong>
        </p>

        {/* QUANTITY */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            margin: "30px 0",
          }}
        >
          <strong>Quantity</strong>

          <button
            onClick={() =>
              quantity > 1 && setQuantity(quantity - 1)
            }
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              quantity < product.stock &&
              setQuantity(quantity + 1)
            }
          >
            +
          </button>
        </div>

        {message && (
          <div
            style={{
              background: "#DCFCE7",
              color: "#15803D",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={addToCart}
          style={{
            width: "100%",
            padding: "14px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          Add to Cart
        </button>

        <button
          onClick={addToWishlist}
          style={{
            width: "100%",
            padding: "14px",
            background: "white",
            color: "#2563EB",
            border: "2px solid #2563EB",
            borderRadius: "10px",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          Add to Wishlist
        </button>

        <button
          onClick={() => navigate("/checkout")}
          style={{
            width: "100%",
            padding: "14px",
            background: "#16A34A",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;