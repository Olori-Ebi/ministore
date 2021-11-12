import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export interface ProductDocument extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      maxlength: 32,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "price is required"],
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: { data: Buffer, contentType: String },
    shipping: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>("Product", ProductSchema);
export default Product;
