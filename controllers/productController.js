import mongoose from "mongoose";
import Product from "../models/Product.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";




// Create product
export const createProduct = async (req, res) => {
  console.log(req.body, req.file)
  try {
    let imageUrl = "";

    // if file is uploaded
    if (req.file) {
      req.file.path, req.file.originalname
      imageUrl = await uploadToCloudinary(req.file.path, req.file.originalname);
    }
    console.log("image url", imageUrl)

    // add image URL into product data
    const productData = {
      ...req.body,
      image: imageUrl,
    };
    console.log(productData)

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // text search on name or description
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    console.log(filter)
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  const id = req.params.id
  try {
    // Check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    console.log("profuctnhi jind", product)
    if (!product) {

      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

