const Product = require("../models/Product");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    let filter = {};

    const { category, minPrice, maxPrice, keyword } = req.query;

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY PRODUCTS
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock),
      image: req.file ? req.file.path : "",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Product created successfully!",
      product,
    });
  } catch (error) {
    console.log("CREATE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner =
      product.createdBy &&
      product.createdBy.toString() === req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You can only update your own products.",
      });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.price = Number(req.body.price);
    product.category = req.body.category;
    product.stock = Number(req.body.stock);

    if (req.file) {
      product.image = req.file.path;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner =
      product.createdBy &&
      product.createdBy.toString() === req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You can only delete your own products.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};