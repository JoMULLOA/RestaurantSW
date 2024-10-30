import { useState, useEffect } from "react";
import { getIngredientes, preparar } from "../services/ingrediente.service.js";

const Chef = () => {
  const [setIngredientes] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ordenEstado, setOrdenEstado] = useState("En Espera"); // Estado para el pedido

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const data = await getIngredientes();
        if (data.status === "Success") {
          setIngredientes(data.data);
        } else {
          console.error("Error al obtener los ingredientes: ", data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor: ", error);
      }
    };
    fetchIngredientes();
  }, );

  const stock = async () => {
    setLoading(true);
    setError(null);

    try {
      const ingrediente = {
        nombre: "Zanahoria",
        cantidad: 1
      };
      const result = await preparar(ingrediente);
      setStockDisponible(result.success);

      // Actualizar el estado de la orden basado en la disponibilidad
      if (result.success) {
        setOrdenEstado("Preparación");
      } else {
        setOrdenEstado("Falta de ingredientes");
      }

    } catch (error) {
      setError("Error al verificar el stock: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "10vh", fontFamily: "Arial, sans-serif" }}>
      {["En Espera", "Preparación", "Falta de ingredientes"].map((estado) => (
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
          <p>{estado}</p>

          {estado === ordenEstado && (
            <div style={{
              border: "1px solid #bbb",
              borderRadius: "4px",
              padding: "10px",
              backgroundColor: "#ffffff",
              marginTop: "10px"
            }}>
              <p><strong>Orden:</strong> #12345</p>
              <p><strong>Mesa:</strong> 10</p>
              <button onClick={handleOpenModal} style={{ marginTop: "10px" }}>Ver Pedido</button>
            </div>
          )}
        </div>
      ))}

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
          }}>
            <h3>Detalles del Pedido</h3>
            <button onClick={stock} style={{ marginTop: "10px" }}>Verificar disponibilidad de Zanahoria</button>

            {loading && <p>Verificando...</p>}
            {error && <p style={{ color: "black" }}>{error}</p>}

            {stockDisponible !== null && !loading && !error && (
              <p>
                {stockDisponible
                  ? "Hay zanahoria disponible en la base de datos."
                  : "No hay zanahoria suficiente en la base de datos."}
              </p>
            )}

            <button onClick={handleCloseModal} style={{ marginTop: "15px", color: "white" }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chef;
