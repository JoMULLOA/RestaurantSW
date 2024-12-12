import { AppDataSource } from "../config/configDb.js";
import Mesa from "../entity/mesa.entity.js";

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
  const { numeroMesa } = req.params;

  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);

    // Buscar la mesa en la base de datos
    const mesa = await mesaRepository.findOne({ where: { numeroMesa } });

    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    // Verificar si la mesa está disponible
    if (mesa.estado !== "Disponible") {
      return res.status(400).json({ message: "La mesa no está disponible para reservar" });
    }

    // Actualizar el estado de la mesa y asignar el garzón
    mesa.estado = "Reservada";
    await mesaRepository.save(mesa);

    return res.status(200).json({ message: "Mesa reservada correctamente", mesa });
  } catch (error) {
    console.error("Error al reservar la mesa:", error);
    return res.status(500).json({ message: "Error al reservar la mesa" });
  }
};

// Liberar una mesa (cambiar estado a "Disponible" y remover garzón asignado)
export const liberarMesa = async (req) => {
  let result;

  // Verificar si req.params está definido
  if (req.params === undefined) {
    result = { numeroMesa: String(req) };
  } else {
    result = req.params;
  }
  // Extraer numeroMesa de result
  const { numeroMesa } = result;
  // const { numeroMesa } = req.params;
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
    console.log("Mesa liberada:", mesa);

    return { message: "Mesa liberada correctamente", mesa };
  } catch (error) {
    console.error("Error al liberar la mesa:", error);
    throw new Error("Error al liberar la mesa");
  }
};

// Agregar una nueva mesa
export const agregarMesa = async (req, res) => {
  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);

    // Obtener el ID máximo actual en la base de datos
    const maxMesa = await mesaRepository
      .createQueryBuilder("mesa")
      .select("MAX(mesa.id)", "max")
      .getRawOne();

    // Calcular el número de la nueva mesa como el máximo ID más 1
    const nuevoNumeroMesa = (maxMesa.max || 0) + 1;

    // Crear y guardar la nueva mesa con el número generado, estado "Disponible" y sin garzón asignado
    const nuevaMesa = mesaRepository.create({
      numeroMesa: nuevoNumeroMesa,
      estado: "Disponible",
      garzonAsignado: null
    });
    
    await mesaRepository.save(nuevaMesa);

    return res.status(201).json({ message: "Mesa agregada correctamente", mesa: nuevaMesa });
  } catch (error) {
    console.error("Error al agregar la mesa:", error);
    return res.status(500).json({ message: "Error al agregar la mesa" });
  }
};

// Eliminar una mesa
// En el backend, en la función para eliminar una mesa
export const eliminarMesa = async (req, res) => {
  const { numeroMesa } = req.params;

  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);

    // Buscar la mesa en la base de datos
    const mesa = await mesaRepository.findOne({ where: { numeroMesa } });

    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    // Eliminar la mesa de la base de datos
    await mesaRepository.remove(mesa);

    return res.status(200).json({ message: "Mesa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la mesa:", error);
    return res.status(500).json({ message: "Error al eliminar la mesa" });
  }
};

//Encontrar mesa con entrada de numeroMesa y retorna la mesa
export const getMesaConN = async (numeroMesa) => {
  try {
    const mesax = await AppDataSource.getRepository(Mesa).findOne({ where: { numeroMesa } });
    return mesax;
  } catch (error) {
    console.error("Error al obtener la mesa:", error);
    return null;
  }
}

export const ocuparMesa = async (req, res) => {
  console.log("O mesa:", req);
  console.log("Ocupando mesa:", { numeroMesa: String(req.numeroMesa) });
  console.log(req.params);
  let result;

  // Verificar si req.params está definido
  if (req.params === undefined) {
    result = { numeroMesa: String(req.numeroMesa) };
    console.log("Odds mesa:", result);
  } else {
    result = req.params;
    console.log("Odo mesa:", result);
  }
  // Extraer numeroMesa de result
  const { numeroMesa } = result;
  // Validar si el número de mesa está presente en el objeto result
  if (!numeroMesa) {
    return res.status(400).json({ message: "Número de mesa no proporcionado" });
  }

  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);
    // Buscar la mesa en la base de datos
    const mesa = await mesaRepository.findOne({ where: { numeroMesa } });
    // Validar si la mesa existe
    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }
    // Verificar si la mesa está disponible
    if (mesa.estado !== "Disponible") {
      return res.status(400).json({ message: "La mesa no está disponible para ocupar" });
    }
    // Actualizar el estado de la mesa a "Ocupada"
    mesa.estado = "Ocupada";
    const mesaOcu = await mesaRepository.save(mesa);
    // Retornar la respuesta de éxito
    return mesaOcu;
  } catch (error) {
    console.error("Error al ocupar la mesa:", error);
  }
};
