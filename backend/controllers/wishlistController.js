const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// ================= GET WISHLIST =================
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [],
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADD TO WISHLIST =================
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

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

    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyExists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updatedWishlist =
      await Wishlist.findById(wishlist._id).populate(
        "products"
      );

    res.status(200).json(updatedWishlist);
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REMOVE FROM WISHLIST =================
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found.",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();

    const updatedWishlist =
      await Wishlist.findById(wishlist._id).populate(
        "products"
      );

    res.status(200).json(updatedWishlist);
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};