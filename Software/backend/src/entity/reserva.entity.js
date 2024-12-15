import { EntitySchema } from "typeorm";

class Reserva {
  constructor(id, nombreReservante, fechaInicioReserva, fechaFinReserva, estado, mesa, garzonAsignado) {
    this.id = id;
    this.nombreReservante = nombreReservante;
    this.fechaInicioReserva = fechaInicioReserva;
    this.fechaFinReserva = fechaFinReserva;
    this.estado = estado;
    this.mesa = mesa;
    this.garzonAsignado = garzonAsignado;
  }
}

const ReservaSchema = new EntitySchema({
  name: "Reserva",
  tableName: "reservas",
  target: Reserva,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nombreReservante: {
      type: "varchar",
      length: 100,
    },
    fechaInicioReserva: {
      type: "timestamp",
    },
    fechaFinReserva: {
      type: "timestamp",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "Pendiente",
    },
  },
  relations: {
    mesa: {
      target: "Mesa",
      type: "many-to-one",
      joinColumn: { name: "mesaId" },
      onDelete: "CASCADE",
    },
    garzonAsignado: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "garzonAsignadoId" },
      nullable: true,
      onDelete: "SET NULL",
    },
  },
});

export default ReservaSchema;
