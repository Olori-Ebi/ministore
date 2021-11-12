import { Request, Response, NextFunction } from "express";
import formidable from "formidable";
import Product from "../models/product.model";
import fs from "fs";
import cloudinary from "../utils/cloudinary";
import { ProductValidate, UpdateProductValidate } from "../validator";
import _ from "lodash";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let form: any = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err: any, fields: any, files: any) => {
      try {
        if (err) {
          return res.status(400).send({
            error: "Image could not be uploaded",
          });
        }

        const validate = await ProductValidate.validateAsync(fields);

        const product: any = new Product({
          name: validate.name,
          description: validate.description,
          price: validate.price,
          quantity: validate.quantity,
          category: validate.category,
          shipping: validate.shipping,
        });

        if (files.photo) {
          product.photo.data = fs.readFileSync(files.photo.filepath);
          product.photo.contentType = files.photo.mimetype;
        }
        if (files.photo.size > 1000000) {
          return res.status(400).send({
            error: "Image should be less than 1mb in size",
          });
        }
        const result = await product.save();
        res.send({
          message: "product created",
          result,
        });
      } catch (error: any) {
        res.send({
          error: error.details[0].message,
        });
      }
    });
  } catch (error: any) {
    if (error.isJoi) {
      return res.status(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }
    next(error);
  }
};

export const getProduct = async (req: any, res: Response) => {
  console.log(req.product);

  return res.status(200).send(req.product);
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    let product = req.product;
    const deletedProduct = await product.remove();
    res.status(200).send({
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    if (error) {
    }
  }
};

export const updateProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let product = req.product;
    const validate = await UpdateProductValidate.validateAsync(req.body);
    product.name = validate.name || product.name;
    product.description = validate.description || product.description;
    product.price = validate.price || product.price;
    product.quantity = validate.quantity || product.quantity;
    product.fileUrl = validate.fileUrl || product.fileUrl;
    product.shipping = validate.shipping || product.shipping;

    await product.save();
    return res.status(200).send({
      message: "update successfully updated",
      product,
    });
  } catch (error: any) {
    if (error.isJoi) {
      return res.status(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }
    next(error);
  }
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, return all products
 */

export const listProducts = async (req: any, res: Response) => {
  try {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? +req.query.limit : 6;

    const products = await Product.find()
      .select("-fileUrl")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit);
    return res.status(200).send({
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

export const relatedProductsList = async (req: any, res: Response) => {
  try {
    let limit = req.query.limit ? +req.query.limit : 6;
    const products = await Product.find({
      _id: { $ne: req.product },
      category: req.product.category,
    })
      .limit(limit)
      .populate("category", "_id name");
    return res.status(200).send({
      products,
    });
  } catch (error) {
    return res.status(400).send({
      error: "products not found",
    });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct("category", {});
    return res.status(200).send({
      categories,
    });
  } catch (error) {
    return res.status(400).send({
      error: "categories not found",
    });
  }
};

export const listBySearch = async (req: Request, res: Response) => {
  try {
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? +req.query.limit : 100;
    let skip = parseInt(req.body.skip) || 0;

    let findArgs = {} as { [key: string]: any };

    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === "price") {
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1],
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }
    const products = await Product.find(findArgs)
      .select("-fileUrl")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);
    return res.status(200).send({
      size: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

// MIDDLEWARE
export const productById = async (
  req: any,
  res: Response,
  next: NextFunction,
  id: number
) => {
  try {
    let product = await Product.findById(id);
    if (!product) {
      res.status(400).json({
        error: "Product not found",
      });
    } else {
      req.product = product as unknown as { [key: string]: any };
      next();
    }
  } catch (error) {
    res.status(400).json({
      error: "Product not found",
    });
  }
};
