import { EntitySchema } from "typeorm";

const Ingrediente = new EntitySchema({
  name: "Ingrediente",
  tableName: "ingredientes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    fechaIngreso: {
      type: "date",
      nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
  },
});

export default Ingrediente;