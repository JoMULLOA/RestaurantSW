import { reservaBodyValidation } from "../validations/reservaValidation.js";

export const validateReserva = (req, res, next) => {
  const { error } = reservaBodyValidation.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Errores de validación.",
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};