import API from "./api";

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await API.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

// Get logged-in user's cart
export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  const response = await API.delete(`/cart/${productId}`);
  return response.data;
};