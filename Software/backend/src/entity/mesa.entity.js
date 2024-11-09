import { EntitySchema } from "typeorm";

class Mesa {
  constructor(id, numeroMesa, estado, garzonAsignado) {
    this.id = id;
    this.numeroMesa = numeroMesa;
    this.estado = estado;
    this.garzonAsignado = garzonAsignado;
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
  },
  relations: {
    garzonAsignado: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "garzonAsignado" },
      nullable: true,
    },
  },
});

export default MesaSchema;
