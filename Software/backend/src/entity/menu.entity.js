import { EntitySchema } from "typeorm";

const Menu = new EntitySchema({
  name: "Menu",
  tableName: "menus",
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
    ingredientes: {
        type: "varchar",
        length: 100,
        nullable: false,
    },
    precio: {
        type: "float",
        nullable: false,
    },
    tipo: {
        type: "varchar",
        length: 100,
        nullable: false,
    },  
    },
    });

export default Menu;