import Joi from "joi";

export const reservaBodyValidation = Joi.object({
  nombreReservante: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras, acentos y espacios
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre del reservante no puede estar vacío.",
      "string.pattern.base": "El nombre del reservante solo puede contener letras y espacios.",
      "string.min": "El nombre del reservante debe tener al menos 1 caracter.",
      "string.max": "El nombre del reservante debe tener como máximo 100 caracteres.",
      "any.required": "El nombre del reservante es obligatorio.",
    }),
  fechaInicioReserva: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "any.required": "La fecha de inicio de la reserva es obligatoria.",
    }),
  fechaFinReserva: Joi.date()
    .greater(Joi.ref("fechaInicioReserva"))
    .required()
    .messages({
      "date.base": "La fecha de fin debe ser una fecha válida.",
      "date.greater": "La fecha de fin debe ser posterior a la fecha de inicio.",
      "any.required": "La fecha de fin de la reserva es obligatoria.",
    }),
  garzonAsignado: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID del garzón debe ser un número válido.",
      "number.positive": "El ID del garzón debe ser un número positivo.",
      "number.integer": "El ID del garzón debe ser un número entero.",
    }),
  numeroMesa: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El número de la mesa debe ser un número válido.",
      "number.positive": "El número de la mesa debe ser un número positivo.",
      "number.integer": "El número de la mesa debe ser un número entero.",
      "any.required": "El número de la mesa es obligatorio.",
    }),
});
