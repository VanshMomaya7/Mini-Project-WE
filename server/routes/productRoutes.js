const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/multerConfig");

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/upload", upload.single("image"), productController.uploadProduct);

module.exports = router;