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
      generated: true,
    },
    //platos pueden ser varios, separados por coma
    plato: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    bebestible: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    postre: {
      type: "varchar",
      length: 100,
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
  },
});

export default Pedido;