const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// ================= CLOUDINARY UPLOAD HELPER =================
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "LabuShop",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

// ================= GET ALL PRODUCTS =================
const getProducts = async (req, res) => {
  try {
    let filter = {};

    const {
      category,
      minPrice,
      maxPrice,
      keyword,
    } = req.query;

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

    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY PRODUCTS =================
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("GET MY PRODUCTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SINGLE PRODUCT =================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CREATE PRODUCT =================
const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    // Upload image directly to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer
      );

      imageUrl = result.secure_url;
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock),
      image: imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Product created successfully!",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message:
        error.message ||
        "Failed to create product.",
    });
  }
};

// ================= UPDATE PRODUCT =================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const isAdmin =
      req.user.role === "admin";

    const isOwner =
      product.createdBy &&
      product.createdBy.toString() ===
        req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message:
          "You can only update your own products.",
      });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.price = Number(req.body.price);
    product.category = req.body.category;
    product.stock = Number(req.body.stock);

    // Upload new image directly to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer
      );

      product.image = result.secure_url;
    }

    const updatedProduct =
      await product.save();

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message:
        error.message ||
        "Failed to update product.",
    });
  }
};

// ================= DELETE PRODUCT =================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const isAdmin =
      req.user.role === "admin";

    const isOwner =
      product.createdBy &&
      product.createdBy.toString() ===
        req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message:
          "You can only delete your own products.",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

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