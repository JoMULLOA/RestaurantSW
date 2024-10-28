"use strict";
import Joi from "joi";

//Ingrediente fue creado así, por lo que las validaciones se enfocan en eso
// CREATE TABLE ingredientes
// (
// 	id int,
// 	tipo varchar(20),
// 	cantidad int,
// 	fechaIngreso timestamp
// )

export const ingredienteQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  tipo: Joi.string()
    .min(3)
    .max(20)
    .messages({
      "string.empty": "El tipo no puede estar vacío.",
      "string.base": "El tipo debe ser de tipo string.",
      "string.min":
        "El tipo debe tener como mínimo 3 caracteres.",
      "string.max":
        "El tipo debe tener como máximo 20 caracteres.",
    }),
  cantidad: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.integer": "La cantidad debe ser un número entero.",
      "number.positive": "La cantidad debe ser un número positivo.",
    }),
  fechaIngreso: Joi.date()
    .messages({
      "date.base": "La fecha de ingreso debe ser de tipo date.",
    }),
})
  .or("id", "tipo", "cantidad", "fechaIngreso")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id, tipo, cantidad o fechaIngreso.",
  });

export const ingredienteBodyValidation = Joi.object({
  tipo: Joi.string()
    .min(3)
    .max(20)
    .messages({
      "string.empty": "El tipo no puede estar vacío.",
      "string.base": "El tipo debe ser de tipo string.",
      "string.min":
        "El tipo debe tener como mínimo 3 caracteres.",
      "string.max":
        "El tipo debe tener como máximo 20 caracteres.",
    }),
  cantidad: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.integer": "La cantidad debe ser un número entero.",
      "number.positive": "La cantidad debe ser un número positivo.",
    }),
  fechaIngreso: Joi.date()
    .messages({
      "date.base": "La fecha de ingreso debe ser de tipo date.",
    }),
});

//La diferencia entre el query y el body es que el query es para hacer busquedas y el body es para agregar un nuevo ingrediente