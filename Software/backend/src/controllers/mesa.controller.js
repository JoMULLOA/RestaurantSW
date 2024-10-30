import { AppDataSource } from "../config/configDb.js";
import Mesa from "../entity/mesa.entity.js";

// Función para obtener todas las mesas
export const obtenerMesas = async (req, res) => {
  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);
    const mesas = await mesaRepository.find({ relations: ["garzon"] }); // Incluye los datos del garzón asignado
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las mesas", error });
  }
};

// Función para reservar una mesa
export const reservarMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);
    const mesa = await mesaRepository.findOne({ where: { id } });

    if (mesa && mesa.estado === "Disponible") {
      mesa.estado = "Reservada";
      await mesaRepository.save(mesa);
      res.json({ message: "Mesa reservada correctamente", mesa });
    } else if (!mesa) {
      res.status(404).json({ message: "Mesa no encontrada" });
    } else {
      res.status(400).json({ message: "La mesa no está disponible para reservar" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al reservar la mesa", error });
  }
};

// Función para liberar una mesa
export const liberarMesa = async (req, res) => {
    const { id } = req.params;
    try {
      const mesaRepository = AppDataSource.getRepository(Mesa);
      const mesa = await mesaRepository.findOne({ where: { id } });
  
      // Verifica que la mesa exista y esté en estado "Ocupada" o "Reservada"
      if (mesa && (mesa.estado === "Ocupada" || mesa.estado === "Reservada")) {
        mesa.estado = "Disponible"; // Cambia el estado a "Disponible"
        await mesaRepository.save(mesa);
        res.json({ message: "Mesa liberada correctamente", mesa });
      } else if (!mesa) {
        res.status(404).json({ message: "Mesa no encontrada" });
      } else {
        res.status(400).json({ message: "La mesa no está en un estado que se pueda liberar" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al liberar la mesa", error });
    }
  };
  