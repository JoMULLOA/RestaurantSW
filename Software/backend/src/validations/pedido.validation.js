"use strict";
import Joi from "joi";

// Obtenemos la fecha actual en formato ISO (sin tiempo)
const getTodayISODate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Definimos el esquema de validación
const pedidoSchema = Joi.object({
  id: Joi.number().integer().positive()
    .messages({
      "number.base": "El ID debe ser un número.",
      "number.integer": "El ID debe ser un número entero.",
      "number.positive": "El ID debe ser un número positivo.",
    }),
  mesa: Joi.number().integer().positive().required()
    .messages({
      "number.base": "La mesa debe ser un número.",
      "number.integer": "La mesa debe ser un número entero.",
      "number.positive": "La mesa debe ser un número positivo.",
      "any.required": "La mesa es obligatoria.",
    }),
  plato: Joi.array().items(Joi.string()).optional()
    .messages({
      "array.base": "El plato debe ser una lista.",
    }),
  bebestible: Joi.array().items(Joi.string()).optional()
    .messages({
      "array.base": "El bebestible debe ser una lista."
    }),
  postre: Joi.array().items(Joi.string()).optional()
    .messages({
      "array.base": "El postre debe ser una lista."
    }),
  modificaciones: Joi.string().allow("").optional()
    .messages({
      "string.base": "Las modificaciones deben ser un texto."
    }),
  fechaIngreso: Joi.string().custom((value, helpers) => {
    const todayISO = getTodayISODate();
    if (value !== todayISO) {
      return helpers.message(`La fecha debe ser la actual (${todayISO}).`);
    }
    return value;
  }).required()
    .messages({
      "string.base": "La fecha de ingreso debe ser una fecha válida en formato ISO.",
      "any.invalid": "La fecha debe ser la actual.",
      "any.required": "La fecha de ingreso es obligatoria."
    })
}).or("plato", "bebestible", "postre")
  .messages({
    "object.missing": "Debe incluir al menos uno entre plato, bebestible o postre."
  });

// Exportamos la función para validar un pedido
export const validatePedido = (data) => {
  return pedidoSchema.validate(data, { abortEarly: false });
};