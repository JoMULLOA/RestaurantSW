import { useState, useEffect } from "react";
import { getIngredientes, preparar } from "../services/ingrediente.service.js";

const Ingrediente = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    fechaIngreso: "",
    cantidad: "",
  });
  const [stockDisponible, setStockDisponible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const stock = async (nombreIngrediente) => {
    setLoading(true);
    setError(null);

    try {
      const result = await preparar([{ nombre: nombreIngrediente, cantidadNecesaria: 1 }]);
      setStockDisponible(result.success);
    } catch (error) {
      setError("Error al verificar el stock: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Gestión de Ingredientes</h1>

      <button onClick={() => stock("zanahoria")}>Verificar disponibilidad de Zanahoria</button>

      {loading && <p>Verificando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stockDisponible !== null && !loading && !error && (
        <p>
          {stockDisponible
            ? "Hay zanahoria disponible en la base de datos."
            : "No hay zanahoria suficiente en la base de datos."}
        </p>
      )}

      <h2>Agregar o Editar Ingrediente</h2>
      <form>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleInputChange}
          placeholder="Nombre del ingrediente"
        />
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleInputChange}
          placeholder="Cantidad"
        />
        <input
          type="date"
          name="fechaIngreso"
          value={form.fechaIngreso}
          onChange={handleInputChange}
          placeholder="Fecha de Ingreso"
        />
      </form>

      {/* Lista de todos los ingredientes obtenidos */}
      <ul>
        {ingredientes.map((ingrediente) => (
          <li key={ingrediente.id}>
            {ingrediente.nombre} - Cantidad: {ingrediente.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingrediente;
