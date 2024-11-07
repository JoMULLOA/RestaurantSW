import { AppDataSource } from "../config/configDb.js";
import Mesa from "../entity/mesa.entity.js";
import User from "../entity/user.entity.js";

// Obtener todas las mesas
export const getMesas = async (req, res) => {
  try {
    const mesas = await AppDataSource.getRepository(Mesa).find({
      relations: ["garzonAsignado"], // Cargar relación con el garzón asignado
    });
    res.json(mesas);
  } catch (error) {
    console.error("Error al obtener las mesas:", error);
    res.status(500).json({ message: "Error al obtener las mesas", error });
  }
};

// Reservar una mesa (cambiar estado a "Ocupada" y asignar un garzón)
export const reservarMesa = async (req, res) => {
  const { numeroMesa, garzonId } = req.body;

  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);
    const garzonRepository = AppDataSource.getRepository(User);

    // Buscar la mesa en la base de datos
    const mesa = await mesaRepository.findOne({ where: { numeroMesa } });

    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    // Verificar si la mesa está disponible
    if (mesa.estado !== "Disponible") {
      return res.status(400).json({ message: "La mesa no está disponible para reservar" });
    }

    // Buscar el garzón en la base de datos
    const garzon = await garzonRepository.findOne({ where: { id: garzonId } });
    if (!garzon) {
      return res.status(404).json({ message: "Garzón no encontrado" });
    }

    // Actualizar el estado de la mesa y asignar el garzón
    mesa.estado = "Reservada";
    mesa.garzonAsignado = null;
    await mesaRepository.save(mesa);

    return res.status(200).json({ message: "Mesa reservada correctamente", mesa });
  } catch (error) {
    console.error("Error al reservar la mesa:", error);
    return res.status(500).json({ message: "Error al reservar la mesa" });
  }
};

// Liberar una mesa (cambiar estado a "Disponible" y remover garzón asignado)
export const liberarMesa = async (req, res) => {
  const { numeroMesa } = req.params;

  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);

    // Buscar la mesa en la base de datos
    const mesa = await mesaRepository.findOne({ where: { numeroMesa }, relations: ["garzonAsignado"] });

    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    // Actualizar el estado de la mesa y eliminar el garzón asignado
    mesa.estado = "Disponible";
    mesa.garzonAsignado = null;
    await mesaRepository.save(mesa);

    return res.status(200).json({ message: "Mesa liberada correctamente", mesa });
  } catch (error) {
    console.error("Error al liberar la mesa:", error);
    return res.status(500).json({ message: "Error al liberar la mesa" });
  }
};
