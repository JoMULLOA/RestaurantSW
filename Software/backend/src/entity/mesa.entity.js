import { EntitySchema } from "typeorm";
import Garzon from "./garzon.entity.js";

const Mesa = new EntitySchema({
  name: "Mesa",
  tableName: "mesas", // Nombre de la tabla en la base de datos
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    numero: {
      type: "varchar",
      unique: true,
    },
    estado: {
      type: "varchar",
      default: "Disponible",
    },
  },
  relations: {
    garzon: {
      target: "Garzon",
      type: "many-to-one",
      joinColumn: true,
      nullable: true,
    },
  },
});

export default Mesa;
