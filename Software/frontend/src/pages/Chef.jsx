import { useState } from "react";

const Chef = () => {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      mesa: 12,
      nombre: "Jose Manriquez",
      ingredientes: ["Tomate", "Lechuga", "Pan"],
      estado: "En Espera",
    },
  ]);

  const verificarInventario = (pedidoId) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId
          ? {
              ...pedido,
              estado:
                pedido.ingredientes.includes("Tomate") &&
                pedido.ingredientes.includes("Lechuga") &&
                pedido.ingredientes.includes("zanahoria")
                  ? "Preparacion"
                  : "Falta de ingredientes",
            }
          : pedido
      )
    );
  };

  const actualizarEstado = (pedidoId, nuevoEstado) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "10vh" }}> {/* Ajuste de margen superior */}
      <div style={{ border: "1px solid black", padding: "20px", flex: 1 }}>
        <h2>En Espera</h2>
        {pedidos
          .filter((pedido) => pedido.estado === "En Espera")
          .map((pedido) => (
            <div key={pedido.id} style={{ marginBottom: "15px" }}>
              <p><strong>Mesa:</strong> {pedido.mesa}</p>
              <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
              <p><strong>Ingredientes:</strong> {pedido.ingredientes.join(", ")}</p>
              <button onClick={() => verificarInventario(pedido.id)}>Verificar Inventario</button>
            </div>
          ))}
      </div>
      
      <div style={{ border: "1px solid black", padding: "20px", flex: 1 }}>
        <h2>Preparacion</h2>
        {pedidos
          .filter((pedido) => pedido.estado === "Preparacion")
          .map((pedido) => (
            <div key={pedido.id} style={{ marginBottom: "15px" }}>
              <p><strong>Mesa:</strong> {pedido.mesa}</p>
              <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
              <button onClick={() => actualizarEstado(pedido.id, "Entrega")}>Actualizar a Entrega</button>
            </div>
          ))}
      </div>
      
      <div style={{ border: "1px solid black", padding: "20px", flex: 1 }}>
        <h2>Falta de ingredientes</h2>
        {pedidos
          .filter((pedido) => pedido.estado === "Falta de ingredientes")
          .map((pedido) => (
            <div key={pedido.id} style={{ marginBottom: "15px" }}>
              <p><strong>Mesa:</strong> {pedido.mesa}</p>
              <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
              <p style={{ color: "red" }}>Falta de ingredientes</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Chef;
