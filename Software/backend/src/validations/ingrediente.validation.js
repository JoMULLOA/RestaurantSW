"use strict";
import Joi from "joi";

//Ingrediente fue creado así, por lo que las validaciones se enfocan en eso
// CREATE TABLE ingredientes
// (
// 	id int,
// 	nombre varchar(20),
// 	cantidad int,
// 	fechaIngreso timestamp
// )

export const ingredienteQueryValidation = Joi.object({

  nombre: Joi.string()
  .min(3)
  .max(20)
  .pattern(/^\D+$/) // Asegura que el nombre no sea un número
  .messages({
    "string.empty": "El nombre no puede estar vacío.",
    "string.base": "El nombre debe ser de tipo string.",
    "string.min": "El nombre debe tener como mínimo 3 caracteres.",
    "string.max": "El nombre debe tener como máximo 20 caracteres.",
    "string.pattern.base": "El nombre no puede ser un número.",
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
      "date.base": "La fecha de ingreso debe ser de nombre date.",
    }),
})
  .or("nombre","fechaIngreso", "cantidad")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id, nombre, cantidad o fechaIngreso.",
  });

export const ingredienteBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(20)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de nombre string.",
      "string.min":
        "El nombre debe tener como mínimo 3 caracteres.",
      "string.max":
        "El nombre debe tener como máximo 20 caracteres.",
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
      "date.base": "La fecha de ingreso debe ser de nombre date.",
    }),
});

//La diferencia entre el query y el body es que el query es para hacer busquedas y el body es para agregar un nuevo ingrediente