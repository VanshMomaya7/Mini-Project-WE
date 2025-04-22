const Product = require("../models/Product");

exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.uploadProduct = async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  const image = req.file.path;
  const product = new Product({ name, category, price, description, stock, image });
  await product.save();
  res.json(product);
};