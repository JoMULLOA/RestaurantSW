import { EntitySchema } from "typeorm";

const Pedido = new EntitySchema({
  name: "Pedido",
  tableName: "pedidos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    mesa: {
      type: "int",
      primary: true,
    },
    //platos pueden ser varios, separados por coma
    plato: {
      type: "json",
      nullable: false,
    },
    bebestible: {
      type: "json",
      nullable: false,
    },
    postre: {
      type: "json",
      nullable: false,
    },
    modificaciones: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    fechaIngreso: {
      type: "date",
      nullable: false,
    },
    Estado:{
      type: "int",
      nullable: false,
      default: 0,
    },
  },
});

export default Pedido;