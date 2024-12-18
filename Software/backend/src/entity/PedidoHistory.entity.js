import { EntitySchema } from "typeorm";

const PedidoHistory = new EntitySchema({
  name: "PedidoHistory",
  tableName: "pedido_history",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    total: {
      type: "float",
      nullable: false,
    },
    fecha: {
      type: "timestamp", // Cambiar de datetime a timestamp
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    idPedido: {
      type: "int",
      generated: false,
    },
  },
});

export default PedidoHistory;