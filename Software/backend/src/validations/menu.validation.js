"use strict";
import Joi from "joi";

export const menuBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 1 caracter.",
      "string.max": "El nombre debe tener como máximo 100 caracteres.",
      "any.required": "El nombre es obligatorio.",
    }),
    // ingredientes: Joi.array()
    // .items(
    //   Joi.object({
    //     nombre: Joi.string().required().messages({
    //       "string.base": "El nombre del ingrediente debe ser de tipo string.",
    //       "any.required": "El nombre del ingrediente es obligatorio.",
    //     }),
    //     cantidad: Joi.number().min(1).required().messages({
    //       "number.base": "La cantidad del ingrediente debe ser de tipo numérico.",
    //       "number.min": "La cantidad del ingrediente debe ser mayor o igual a 1.",
    //       "any.required": "La cantidad del ingrediente es obligatoria.",
    //     }),
    //   })
    // )
    // .min(1)
    // .required()
    // .messages({
    //   "array.base": "Los ingredientes deben ser de tipo array.",
    //   "array.min": "Debe haber al menos un ingrediente.",
    //   "any.required": "Los ingredientes son obligatorios.",
    // }),
    // precio: Joi.number()
    // .min(0)
    // .required()
    // .messages({
    //   "number.base": "El precio debe ser de tipo numérico.",
    //   "number.min": "El precio debe ser mayor o igual a 0.",
    //   "any.required": "El precio es obligatorio.",
    // }),
  });
