import express from "express";
import {
  create,
  categoryById,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "../controllers/category.controller";
import { userById } from "../controllers/user.controller";
import { verifyAdmin } from "../middleware/Authentication";

const categoryRouter = express.Router();

categoryRouter.post("/category/create/:userId", verifyAdmin, create);
categoryRouter.put("/category/create/:userId", verifyAdmin, updateCategory);
categoryRouter.delete("/category/create/:userId", verifyAdmin, deleteCategory);
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/category/:categoryId", getCategory);

categoryRouter.param("userId", userById);
categoryRouter.param("categoryId", categoryById);

export default categoryRouter;
