import express from "express";
import {
  create,
  productById,
  getProduct,
  deleteProduct,
  updateProduct,
  listProducts,
  relatedProductsList,
  listCategories,
  listBySearch,
} from "../controllers/product.controller";
import { userById } from "../controllers/user.controller";
import { verifyAdmin } from "../middleware/Authentication";
import upload from "../utils/multer";

const productRouter = express.Router();

productRouter.post("/product/create/:userId", verifyAdmin, create);

productRouter.get("/product/:productId", getProduct);
productRouter.delete("/product/:productId/:userId", verifyAdmin, deleteProduct);
productRouter.put("/product/:productId/:userId", verifyAdmin, updateProduct);
productRouter.get("/products", listProducts);
productRouter.get("/products/related/:productId", relatedProductsList);
productRouter.get("/products/categories", listCategories);
productRouter.post("/products/by/search", listBySearch);

productRouter.param("userId", userById);
productRouter.param("productId", productById);

export default productRouter;
