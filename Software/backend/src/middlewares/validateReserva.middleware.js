import { reservaBodyValidation } from "../validations/reservaValidation.js";

export const validateReserva = (req, res, next) => {
  const { error } = reservaBodyValidation.validate(req.body, { abortEarly: false });
  if (error) {
    const mensajes = error.details.map((detalle) => detalle.message);
    return res.status(400).json({ errores: mensajes }); // Devuelve un array de errores
  }
  next();
};
