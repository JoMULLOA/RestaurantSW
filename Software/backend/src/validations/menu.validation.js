"use strict";
import Joi from "joi";

export const menuBodyValidation = Joi.object({
  nombre: Joi.string()
    .trim()
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
  ingredientes: Joi.array()
    .items(
      Joi.object({
        nombre: Joi.string()
          .trim()
          .required()
          .messages({
            "string.base": "El nombre del ingrediente debe ser de tipo string.",
            "string.empty": "El nombre del ingrediente no puede estar vacío.",
            "any.required": "El nombre del ingrediente es obligatorio.",
          }),
        cantidad: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": "La cantidad del ingrediente debe ser de tipo numérico.",
            "number.integer": "La cantidad del ingrediente debe ser un número entero.",
            "number.min": "La cantidad del ingrediente debe ser mayor o igual a 1.",
            "any.required": "La cantidad del ingrediente es obligatoria.",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Los ingredientes deben ser de tipo array.",
      "array.min": "Debe haber al menos un ingrediente.",
      "any.required": "Los ingredientes son obligatorios.",
    }),
  precio: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "El precio debe ser de tipo numérico.",
      "number.positive": "El precio debe ser mayor que 0.",
      "number.precision": "El precio debe tener como máximo 2 decimales.",
      "any.required": "El precio es obligatorio.",
    }),
  tipo: Joi.string()
    .trim()
    .valid("Bebestible", "Comida", "Postre") // Agregar valores válidos opcionalmente
    .required()
    .messages({
      "string.base": "El tipo debe ser de tipo string.",
      "string.empty": "El tipo no puede estar vacío.",
      "any.only": "El tipo debe ser uno de los siguientes: Bebestible, Comida, Postre.",
      "any.required": "El tipo es obligatorio.",
    }),
});

