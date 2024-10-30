"use strict";
import { EntitySchema } from "typeorm";

const IngredienteSchema = new EntitySchema({
  name: "Ingrediente",
  tableName: "ingredientes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    cantidad: {
        type: "int",
        primary: true,
        generated: true,
    },
    fechaIngreso: {
        type: "timestamp with time zone",
        default: () => "CURRENT_TIMESTAMP",
        nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_INGREDIENTE",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default IngredienteSchema;