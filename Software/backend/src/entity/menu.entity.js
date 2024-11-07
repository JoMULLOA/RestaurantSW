import { EntitySchema } from "typeorm";

const menu = new EntitySchema({
    name: "Menu",
    tableName: "menu",
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
    },
});

export default menu;
