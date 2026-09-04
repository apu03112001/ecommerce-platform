const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ================= GET CART =================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADD TO CART =================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const itemQuantity = Number(quantity) || 1;

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += itemQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: itemQuantity,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("ADD CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE CART ITEM =================
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required.",
      });
    }

    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        cartItem.product.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        message: "Product is not in the cart.",
      });
    }

    item.quantity = newQuantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REMOVE FROM CART =================
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId.toString()
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CLEAR CART =================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty.",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully!",
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= EXPORT =================
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};