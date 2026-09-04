import { useEffect, useState } from "react";
import API from "../services/api";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch Cart
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get("/cart");

      const items = response.data.products || [];
      setCart(items);

      const total = items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      setTotalAmount(total);
    } catch (error) {
      console.log("Cart Error:", error);
    }
  };

  // Razorpay Payment
  const handlePayment = async () => {
    try {
      setLoading(true);

      console.log("Creating Razorpay Order...");

      // Backend creates Razorpay order
      const { data: order } = await API.post("/orders/payment", {
        amount: totalAmount,
      });

      console.log("Razorpay Order:", order);

      const options = {
        key: "rzp_test_TXXoH8WEuaax70", // Your Test Key ID
        amount: order.amount,
        currency: order.currency,
        name: "LabuShop",
        description: "E-Commerce Payment",
        order_id: order.id,

        prefill: {
          name: "Labu",
          email: "labu@gmail.com",
          contact: "9999999999",
        },

        theme: {
          color: "#2563EB",
        },

        handler: async function (response) {
          console.log("Payment Success Response:", response);

          try {
            // Verify payment signature
            const verify = await API.post(
              "/orders/verify-payment",
              response
            );

            console.log("Verification Response:", verify.data);

            // Place order in MongoDB
            const placed = await API.post("/orders");

            console.log("Order Saved:", placed.data);

            // Clear cart
            await API.delete("/cart/clear");

            alert("Payment Successful!");

            fetchCart();
          } catch (err) {
            console.log("Verification Error:", err.response || err);
            alert("Payment verification failed.");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("User closed Razorpay popup.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // Payment Failed Listener
      razorpay.on("payment.failed", function (response) {
        console.log("Payment Failed:", response.error);

        alert(
          `Payment Failed\n\nReason: ${response.error.description}`
        );
      });

      razorpay.open();

      setLoading(false);
    } catch (error) {
      console.log("Payment Error:", error.response || error);
      alert("Unable to initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#1E40AF" }}>Checkout</h1>

      <p>Review your order before payment.</p>

      {cart.length === 0 ? (
        <h2>Your cart is empty.</h2>
      ) : (
        cart.map((item) => (
          <div
            key={item.product._id}
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              padding: "15px",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            {/* Product Image Placeholder */}
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#E5E7EB",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#666",
              }}
            >
              Image
            </div>

            <div style={{ flex: 1 }}>
              <h3>{item.product.name}</h3>

              <p>{item.product.description}</p>

              <p>
                Quantity: <strong>{item.quantity}</strong>
              </p>

              <h3 style={{ color: "#2563EB" }}>
                ₹ {item.product.price * item.quantity}
              </h3>
            </div>
          </div>
        ))
      )}

      {cart.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#EFF6FF",
            borderRadius: "12px",
          }}
        >
          <h2>Total Amount</h2>

          <h1 style={{ color: "#2563EB" }}>₹ {totalAmount}</h1>

          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: loading ? "#9CA3AF" : "#16A34A",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {loading ? "Opening Payment..." : `Pay ₹ ${totalAmount}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;