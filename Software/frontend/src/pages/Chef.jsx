import { useState, useEffect } from "react";

const Chef = () => {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      mesa: 12,
      nombre: "Jose Manriquez",
      ingredientes: ["zanahoria"],
      estado: "Falta de ingredientes",
    },
  ]);
  const [ingredientes, setIngredientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

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

  const abrirModalIngredientes = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setPedidoSeleccionado(null);
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "10vh", fontFamily: "Arial, sans-serif" }}>
      {["En Espera", "Preparacion", "Falta de ingredientes"].map((estado) => (
        <div
          key={estado}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            flex: 1,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ color: estado === "Falta de ingredientes" ? "red" : "#333" }}>{estado}</h2>
          {pedidos
            .filter((pedido) => pedido.estado === estado)
            .map((pedido) => (
              <div key={pedido.id} style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#fff", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                <p><strong>Mesa:</strong> {pedido.mesa}</p>
                <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
                <button
                  style={{ padding: "8px 12px", border: "none", backgroundColor: "#28a745", color: "white", borderRadius: "4px", cursor: "pointer" }}
                  onClick={() => abrirModalIngredientes(pedido)}
                >
                  Ver Pedido
                </button>
                {estado === "En Espera" && (
                  <button
                    style={{ padding: "8px 12px", border: "none", backgroundColor: "#007bff", color: "white", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => verificarInventario(pedido.id)}
                  >
                    Verificar Inventario
                  </button>
                )}
                {estado === "Preparacion" && (
                  <button
                    style={{ padding: "8px 12px", border: "none", backgroundColor: "#ffc107", color: "white", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => actualizarEstado(pedido.id, "Entrega")}
                  >
                    Actualizar a Entrega
                  </button>
                )}
                {estado === "Falta de ingredientes" && (
                  <button
                    style={{ padding: "8px 12px", border: "none", backgroundColor: "#17a2b8", color: "white", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => verificarInventario(pedido.id)}
                  >
                    Actualizar Pedido
                  </button>
                )}
              </div>
            ))}
        </div>
      ))}

      {modalVisible && pedidoSeleccionado && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "300px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            <h3>Ingredientes del Pedido</h3>
            <ul>
              {pedidoSeleccionado.ingredientes.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
            <button
              style={{
                marginTop: "20px",
                padding: "8px 12px",
                border: "none",
                backgroundColor: "#dc3545",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={cerrarModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chef;
