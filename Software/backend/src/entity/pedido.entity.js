import { EntitySchema } from "typeorm";
import Mesa from "./mesa.entity.js";

const Pedido = new EntitySchema({
  name: "Pedido",
  tableName: "pedidos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    descripcion: {
      type: "varchar",
    },
    estado: {
      type: "varchar",
      default: "Pendiente",
    },
  },
  relations: {
    mesa: {
      target: "Mesa",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default Pedido;
