"use strict";
import { EntitySchema } from "typeorm";

const IngredientSchema = new EntitySchema({
  name: "Ingredient",
  tableName: "ingredientes", // nombre de la tabla en PostgreSQL
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    precio: {
      type: "int",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_INGREDIENT",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_INGREDIENT_NOMBRE",
      columns: ["nombre"],
    },
  ],
});

export default IngredientSchema;
