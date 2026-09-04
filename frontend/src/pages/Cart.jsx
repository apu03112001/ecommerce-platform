import { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await getCart();

      // Backend returns { products: [...] }
      setCart(response.products || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove product
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (error) {
      alert("Failed to remove product.");
    }
  };

  // Calculate total
  const totalAmount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading Cart...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ color: "#1E40AF", marginBottom: "25px" }}>
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <h3>Your cart is empty.</h3>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.product._id}
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                background: "white",
              }}
            >
              {/* Placeholder Image */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: "#F3F4F6",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                Image
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: "10px" }}>{item.product.name}</h2>

                <p>{item.product.description}</p>

                <h3 style={{ color: "#2563EB" }}>
                  ₹ {item.product.price}
                </h3>

                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>

                <p>
                  <strong>Subtotal:</strong> ₹{" "}
                  {item.product.price * item.quantity}
                </p>

                <button
                  onClick={() => handleRemove(item.product._id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 18px",
                    background: "#DC2626",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Section */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#EFF6FF",
              borderRadius: "12px",
            }}
          >
            <h2>Total Amount: ₹ {totalAmount}</h2>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                marginTop: "15px",
                padding: "14px 24px",
                background: "#16A34A",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;