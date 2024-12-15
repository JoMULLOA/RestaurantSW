import { AppDataSource } from "../config/configDb.js";
import Mesa from "../entity/mesa.entity.js";
import { asignarGarzon } from "../services/mesa.service.js"; // Ajusta el path según tu estructura de archivos


// Obtener todas las mesas
export const getMesas = async (req, res) => {
  try {
    const mesaRepository = AppDataSource.getRepository(Mesa);

    // Cargar reservas y garzón asignado de las reservas
    const mesas = await mesaRepository.find({
      relations: ["garzonAsignado", "reservas", "reservas.garzonAsignado"],
    });

    // Recorrer las mesas y si una está Ocupada, buscar la reserva Confirmada
    const mesasConGarzon = mesas.map((mesa) => {
      if (mesa.estado === "Ocupada") {
        // Buscar la reserva con estado Confirmada
        // Si hay varias, podrías filtrar la más reciente, pero asumiendo una sola:
        const reservaConfirmada = mesa.reservas.find((reserva) => reserva.estado === "Confirmada");

        if (reservaConfirmada && reservaConfirmada.garzonAsignado) {
          // Asignar el garzonAsignado desde la reserva confirmada
          mesa.garzonAsignado = reservaConfirmada.garzonAsignado;
        }
      }
      return mesa;
    });

    res.json(mesasConGarzon);
  } catch (error) {
    console.error("Error al obtener las mesas:", error);
    res.status(500).json({ message: "Error al obtener las mesas", error });
  }
};

export const asignarGarzonAMesa = async (req, res) => {
  const { numeroMesa } = req.params;
  const { id } = req.body;

  console.log("Datos recibidos en el controlador:", { numeroMesa, id });

  try {
    const mesaActualizada = await asignarGarzon(numeroMesa, id);

    res.status(200).json({ message: "Garzón asignado correctamente", mesa: mesaActualizada });
  } catch (error) {
    console.error("Error en asignarGarzonAMesa:", error.message);
    res.status(500).json({ message: error.message, stack: error.stack }); // Devuelve detalles del error
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

    // Obtener todas las mesas ordenadas por número de mesa
    const todasLasMesas = await mesaRepository
      .createQueryBuilder("mesa")
      .select("mesa.numeroMesa")
      .orderBy("mesa.numeroMesa", "ASC")
      .getRawMany();

    // Encontrar el primer espacio disponible en la secuencia de números de mesa
    let nuevoNumeroMesa = 1;
    for (let i = 0; i < todasLasMesas.length; i++) {
      if (todasLasMesas[i].mesa_numeroMesa !== nuevoNumeroMesa) {
        break;
      }
      nuevoNumeroMesa++;
    }

    // Crear y guardar la nueva mesa con el número generado, estado "Disponible" y sin garzón asignado
    const nuevaMesa = mesaRepository.create({
      numeroMesa: nuevoNumeroMesa,
      estado: "Disponible",
      garzonAsignado: null
    });

    await mesaRepository.save(nuevaMesa);
    res.status(201).json(nuevaMesa);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la mesa", error });
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
