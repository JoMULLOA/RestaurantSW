import { useState, useEffect } from "react";

const Chef = () => {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      mesa: 12,
      nombre: "Jose Manriquez",
      ingredientes: ["zanahoria"],
      estado: "En Espera",
    },
  ]);
  const [ingredientes, setIngredientes] = useState([]);

  // Función para obtener ingredientes desde el backend
  const fetchIngredientes = async () => {
    try {
      const response = await fetch("/ingredients");
      if (!response.ok) {
        throw new Error("Error al obtener los ingredientes");
      }
      const data = await response.json();
      setIngredientes(data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const verificarInventario = (pedidoId) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) => {
        if (pedido.id === pedidoId) {
          const ingredientesDisponibles = pedido.ingredientes.every((ing) =>
            ingredientes.some((item) => item.nombre === ing)
          );

          return {
            ...pedido,
            estado: ingredientesDisponibles ? "Preparacion" : "Falta de ingredientes",
          };
        }
        return pedido;
      })
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
    <div style={{ display: "flex", gap: "20px", marginTop: "10vh" }}>
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
