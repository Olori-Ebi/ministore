import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface CategoryDocument extends mongoose.Document {
  name: string;
}

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<CategoryDocument>("Category", CategorySchema);
export default Category;
