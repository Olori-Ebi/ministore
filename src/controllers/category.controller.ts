import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";

export const create = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    const data = await category.save();
    return res.status(200).json({ data });
  } catch (error: any) {
    if (error.code === 11000)
      return res.status(400).send({
        error: "category must be unique",
      });
  }
};

export const getCategory = async (req: any, res: Response) => {
  return res.status(200).send(req.category);
};

export const updateCategory = async (req: any, res: Response) => {
  try {
    const category = req.category;
    category.name = req.body.name;
    await category.save();
    res.status(200).send(category);
  } catch (error) {
    return res.status(400).send({
      error,
    });
  }
};

export const deleteCategory = async (req: any, res: Response) => {
  try {
    const category = req.category;
    await category.remove();
    res.status(200).send({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(400).send({
      error,
    });
  }
};

export const getCategories = async (req: any, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      categories,
    });
  } catch (error) {
    return res.status(400).send({
      error,
    });
  }
};

export const categoryById = async (
  req: any,
  res: Response,
  next: NextFunction,
  id: number
) => {
  try {
    let category = await Category.findById(id);
    if (!category) {
      res.status(400).json({
        error: "Category not found",
      });
    } else {
      req.category = category as unknown as { [key: string]: string };
      next();
    }
  } catch (error) {
    return res.status(400).json({
      error: "Category not found",
    });
  }
};
