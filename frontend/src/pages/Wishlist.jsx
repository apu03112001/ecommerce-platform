import { useEffect, useState } from "react";
import {
  getWishlist,
  removeWishlist,
} from "../services/wishlistService";
import { addToCart } from "../services/cartService";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.products || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeWishlist(productId);
      fetchWishlist();
    } catch (error) {
      alert("Failed to remove item.");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await removeWishlist(productId);

      fetchWishlist();

      alert("Moved to cart!");
    } catch (error) {
      alert("Failed to move item.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading Wishlist...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ color: "#EC4899", marginBottom: "25px" }}>
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <h3>No products in wishlist.</h3>
      ) : (
        wishlist.map((item) => (
          <div
            key={item.product._id}
            style={{
              display: "flex",
              gap: "20px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
              }}
            >
              Image
            </div>

            <div style={{ flex: 1 }}>
              <h2>{item.product.name}</h2>

              <p>{item.product.description}</p>

              <h3 style={{ color: "#2563EB" }}>
                ₹ {item.product.price}
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => handleMoveToCart(item.product._id)}
                  style={{
                    padding: "10px 18px",
                    background: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Move to Cart
                </button>

                <button
                  onClick={() => handleRemove(item.product._id)}
                  style={{
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
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;