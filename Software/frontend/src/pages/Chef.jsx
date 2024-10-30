import { useState, useEffect } from "react";
import { getIngredientes, preparar } from "../services/ingrediente.service.js";

const Chef = () => {
  const [setIngredientes] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ordenEstado, setOrdenEstado] = useState("En Espera");

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
        cantidad: 1,
      };
      const result = await preparar(ingrediente);
      setStockDisponible(result.success);

      if (result.success) {
        setOrdenEstado("Falta de ingredientes");
      } else {
        setOrdenEstado("Preparación");
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
    <div style={{ display: "flex", gap: "40px", marginTop: "5vh", fontFamily: "Arial, sans-serif", padding: "0 10%" }}>
      {["En Espera", "Preparación", "Falta de ingredientes"].map((estado) => (
        <div
          key={estado}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            flex: 1,
            backgroundColor: "#f1f1f1",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: "bold", color: "#333", fontSize: "1.2em" }}>{estado}</p>

          {estado === ordenEstado && (
            <div
              style={{
                border: "1px solid #bbb",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#ffffff",
                marginTop: "15px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Orden: #12345</p>
              <p>Mesa: 10</p>
              <button
                onClick={handleOpenModal}
                style={{
                  marginTop: "15px",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  backgroundColor: "#7A4F42", // Color marrón aplicado aquí
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Ver Pedido
              </button>
            </div>
          )}
        </div>
      ))}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "350px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3 style={{ color: "#333", marginBottom: "15px" }}>Detalles del Pedido</h3>
            <button
              onClick={stock}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#7A4F42",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                marginBottom: "15px",
              }}
            >
              Verificar disponibilidad de Zanahoria
            </button>

            {loading && <p>Verificando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {stockDisponible !== null && !loading && !error && (
              <p style={{ color: "#333", fontSize: "1em", marginTop: "10px" }}>
                {stockDisponible
                  ? "No hay zanahoria suficiente en la base de datos."
                  : "Hay zanahoria suficiente en la base de datos."}
              </p>
            )}

            <button
              onClick={handleCloseModal}
              style={{
                marginTop: "15px",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#7A4F42",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                width: "auto", // Ajuste de ancho automático
              }}
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