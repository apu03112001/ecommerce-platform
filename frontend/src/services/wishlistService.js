import API from "./api";

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const response = await API.post("/wishlist", {
    productId,
  });

  return response.data;
};

// Get wishlist
export const getWishlist = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

// Remove wishlist item
export const removeWishlist = async (productId) => {
  const response = await API.delete(`/wishlist/${productId}`);
  return response.data;
};