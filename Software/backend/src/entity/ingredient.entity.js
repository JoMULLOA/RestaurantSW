"use strict";
import { EntitySchema } from "typeorm";

const IngredientSchema = new EntitySchema({
  name: "Ingredients",
  tableName: "ingredientes",
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
});

export default IngredientSchema;
