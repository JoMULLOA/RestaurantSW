import { AppDataSource } from "../config/configDb.js";
import Reserva from "../entity/reserva.entity.js";
import Mesa from "../entity/mesa.entity.js";
import { In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";


export const cancelarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    const reservaRepo = AppDataSource.getRepository(Reserva);
    const reserva = await reservaRepo.findOne({ where: { id }, relations: ["mesa"] });

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada." });
    }

    if (reserva.estado !== "Pendiente" && reserva.estado !== "Confirmada") {
      return res.status(400).json({
        message: "Solo se pueden cancelar reservas en estado 'Pendiente' o 'Confirmada'.",
      });
    }

    reserva.estado = "Cancelada";
    await reservaRepo.save(reserva);

    return res.status(200).json({ message: "Reserva cancelada correctamente." });
  } catch (error) {
    console.error("Error al cancelar la reserva:", error);
    return res.status(500).json({ message: "Error al cancelar la reserva." });
  }
};

export const reservarMesa = async (req, res) => {
  const { numeroMesa, garzonAsignado, nombreReservante, fechaInicioReserva, fechaFinReserva } = req.body;
  console.log("Datos recibidos en el controlador:", {
    numeroMesa,
    garzonAsignado,
    nombreReservante,
    fechaInicioReserva,
    fechaFinReserva,
  });

  try {
    const mesaRepo = AppDataSource.getRepository(Mesa);
    const reservaRepo = AppDataSource.getRepository(Reserva);

    const ahora = new Date();
    const fechaInicio = new Date(fechaInicioReserva);
    const fechaFin = new Date(fechaFinReserva);

    // Validar formato de fechas
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return res.status(400).json({ message: "Formato de fecha/hora inválido." });
    }

    // Validar que las fechas sean válidas
    if (fechaInicio < ahora || fechaInicio >= fechaFin) {
      return res.status(400).json({
        message: "La fecha de inicio debe ser mayor a la actual y menor a la fecha de fin.",
      });
    }

    // Validar que la mesa existe
    const mesa = await mesaRepo.findOne({ where: { numeroMesa } });
    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada." });
    }

    // Verificar si ya existe una reserva para esta misma mesa dentro del rango de fechas
    // Usar mesa: { id: mesa.id } si la relación es un objeto
    const reservaExistente = await reservaRepo.findOne({
      where: {
        mesa: { id: mesa.id },
        estado: In(["Pendiente", "Confirmada"]),
        fechaInicioReserva: LessThanOrEqual(fechaFin),
        fechaFinReserva: MoreThanOrEqual(fechaInicio),
      },
    });

    if (reservaExistente) {
      return res.status(400).json({
        message: "Ya existe una reserva para esta mesa en ese rango de fechas.",
      });
    }

    // Crear la nueva reserva
    const nuevaReserva = reservaRepo.create({
      nombreReservante,
      fechaInicioReserva: fechaInicio,
      fechaFinReserva: fechaFin,
      estado: "Pendiente",
      mesa: mesa,  // pasar el objeto mesa completo, si la relación está definida de esa manera
      garzonAsignado
    });

    await reservaRepo.save(nuevaReserva);

    return res.status(201).json({
      message: "Mesa reservada exitosamente.",
      reserva: nuevaReserva,
    });
  } catch (error) {
    console.error("Error al reservar la mesa:", error);
    return res.status(500).json({ message: "Error al reservar la mesa." });
  }
};

export const actualizarEstadoMesas = async () => {
  const reservaRepo = AppDataSource.getRepository(Reserva);
  const mesaRepo = AppDataSource.getRepository(Mesa);

  const ahora = new Date();

  try {
    const reservas = await reservaRepo.find({ relations: ["mesa"] });

    for (const reserva of reservas) {
      if (reserva.estado === "Pendiente" && ahora >= new Date(reserva.fechaInicioReserva)) {
        reserva.estado = "Confirmada";
        reserva.mesa.estado = "Ocupada";
        await reservaRepo.save(reserva);
        await mesaRepo.save(reserva.mesa);
      } else if (reserva.estado === "Confirmada" && ahora >= new Date(reserva.fechaFinReserva)) {
        reserva.estado = "Finalizada";
        reserva.mesa.estado = "Disponible";
        await reservaRepo.save(reserva);
        await mesaRepo.save(reserva.mesa);
      }
    }

    console.log("Estados de las mesas y reservas actualizados.");
  } catch (error) {
    console.error("Error al actualizar los estados de las mesas:", error);
  }
};

export const obtenerReservas = async (req, res) => {
  try {
    const reservaRepo = AppDataSource.getRepository(Reserva);

    // Obtener reservas con relaciones hacia Mesa y User
    const reservas = await reservaRepo.find({
      relations: ["mesa", "garzonAsignado"], // Incluye la relación con garzonAsignado
    });

    // Mapear las reservas para incluir solo los datos necesarios
    const reservasConDatosCompletos = reservas.map((reserva) => ({
      id: reserva.id,
      nombreReservante: reserva.nombreReservante,
      fechaInicioReserva: reserva.fechaInicioReserva,
      fechaFinReserva: reserva.fechaFinReserva,
      estado: reserva.estado,
      mesa: {
        id: reserva.mesa.id,
        numeroMesa: reserva.mesa.numeroMesa,
      },
      garzonAsignado: reserva.garzonAsignado
        ? {
            id: reserva.garzonAsignado.id,
            nombreCompleto: reserva.garzonAsignado.nombreCompleto,
          }
        : null, // Si no hay un garzón asignado, devuelve null
    }));

    res.status(200).json(reservasConDatosCompletos);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ message: "Error al obtener reservas." });
  }
};