import { EntitySchema } from "typeorm";

class Mesa {
  constructor(id, numeroMesa, estado, garzonAsignado, fechaEstado, reservas) {
    this.id = id;
    this.numeroMesa = numeroMesa;
    this.estado = estado;
    this.garzonAsignado = garzonAsignado;
    this.fechaEstado = fechaEstado;
    this.reservas = reservas; // Relación con reservas
  }
}

const MesaSchema = new EntitySchema({
  name: "Mesa",
  tableName: "mesas",
  target: Mesa,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    numeroMesa: {
      type: "int",
      unique: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "Disponible",
    },
    fechaEstado: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    garzonAsignado: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "garzonAsignado" },
      nullable: true,
    },
    reservas: {
      target: "Reserva",
      type: "one-to-many",
      inverseSide: "mesa",
      cascade: true
    }
  },
});

export default MesaSchema;

