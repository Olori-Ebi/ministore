import Joi from "joi";

export const Validate = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

export const ProductValidate = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  category: Joi.string().required(),
  shipping: Joi.boolean(),
});

export const UpdateProductValidate = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number(),
  category: Joi.string(),
  shipping: Joi.boolean(),
});
