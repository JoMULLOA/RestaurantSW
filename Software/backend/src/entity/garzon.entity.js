import { EntitySchema } from "typeorm";

const Garzon = new EntitySchema({
  name: "Garzon",
  tableName: "garzones",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
  },
});

export default Garzon;
