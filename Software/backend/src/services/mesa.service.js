// mesa.service.js
import { AppDataSource } from "../config/configDb.js";
import Mesa from "../entity/mesa.entity.js";
import User from "../entity/user.entity.js"; // Importar la entidad User

export const getMesas = async () => {
  const mesaRepository = AppDataSource.getRepository(Mesa);
  return await mesaRepository.find({ relations: ["garzonAsignado"] });
};

export const asignarGarzon = async (numeroMesa, garzonName) => {
  const mesaRepository = AppDataSource.getRepository(Mesa);
  const userRepository = AppDataSource.getRepository(User);

  try {
    console.log("Buscando mesa con numeroMesa:", numeroMesa);
    const mesa = await mesaRepository.findOne({ where: { numeroMesa } });

    if (!mesa) {
      console.error("Mesa no encontrada");
      throw new Error("Mesa no encontrada");
    }

    console.log("Buscando garzón con nombre:", garzonName);
    const garzon = await userRepository.findOne({ where: { nombreCompleto: garzonName } });

    if (!garzon) {
      console.error("Garzón no encontrado");
      throw new Error("Garzón no encontrado");
    }

    console.log("Asignando garzón a la mesa...");
    mesa.garzonAsignado = garzon;

    console.log("Mesa antes de guardar:", mesa);
    const mesaActualizada = await mesaRepository.save(mesa);
    console.log("Mesa guardada exitosamente:", mesaActualizada);

    return mesaActualizada;
  } catch (error) {
    console.error("Error en asignarGarzon:", error.message);
    throw error;
  }
};

export const crearReserva = async ({ mesaId, nombreReservante, horaReserva }) => {
  const reservaRepository = AppDataSource.getRepository(Reserva);

  const nuevaReserva = reservaRepository.create({
    mesa: mesaId,
    nombreReservante,
    horaReserva: new Date(horaReserva),
    estado: "Reservada",
  });

  return await reservaRepository.save(nuevaReserva);
};


export const ocuparMesa = async (numeroMesa) => {
  const mesaRepository = AppDataSource.getRepository(Mesa);
  const mesa = await mesaRepository.findOne({ where: { numeroMesa } });
  if (!mesa) throw new Error("Mesa no encontrada");
  if (mesa.estado !== "Disponible") throw new Error("La mesa no está disponible para ocupar");
  mesa.estado = "Ocupada";
  return await mesaRepository.save(mesa);
};

export const liberarMesa = async (numeroMesa) => {
  const mesaRepository = AppDataSource.getRepository(Mesa);
  const mesa = await mesaRepository.findOne({ where: { numeroMesa }, relations: ["garzonAsignado"] });
  if (!mesa) throw new Error("Mesa no encontrada");
  mesa.estado = "Disponible";
  mesa.garzonAsignado = null;
  return await mesaRepository.save(mesa);
};

export const agregarMesa = async () => {
  const mesaRepository = AppDataSource.getRepository(Mesa);
  const todasLasMesas = await mesaRepository
    .createQueryBuilder("mesa")
    .select("mesa.numeroMesa")
    .orderBy("mesa.numeroMesa", "ASC")
    .getRawMany();

  let nuevoNumeroMesa = 1;
  for (let i = 0; i < todasLasMesas.length; i++) {
    if (todasLasMesas[i].mesa_numeroMesa !== nuevoNumeroMesa) {
      break;
    }
    nuevoNumeroMesa++;
  }

  const nuevaMesa = mesaRepository.create({
    numeroMesa: nuevoNumeroMesa,
    estado: "Disponible",
    garzonAsignado: null
  });

  return await mesaRepository.save(nuevaMesa);
};

export const eliminarMesa = async (numeroMesa) => {
  const mesaRepository = AppDataSource.getRepository(Mesa);
  const mesa = await mesaRepository.findOne({ where: { numeroMesa } });
  if (!mesa) throw new Error("Mesa no encontrada");
  return await mesaRepository.remove(mesa);
};

