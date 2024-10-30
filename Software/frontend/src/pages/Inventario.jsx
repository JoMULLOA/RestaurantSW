// Ingrediente.jsx
import { useState, useEffect } from 'react';
import { addIngrediente, getIngredientes, removeIngrediente } from '../services/ingrediente.service.js';
import '@styles/inventario.css';

const Ingrediente = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    fechaIngreso: '',
    cantidad: ''
  });

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const data = await getIngredientes();
        if (data.status === 'Success') {
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
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await addIngrediente(form);
      if (data.status === 'Success') {
        setIngredientes([...ingredientes, data.data]);
        setForm({
          id: '',
          nombre: '',
          fechaIngreso: '',
          cantidad: ''
        });
      } else {
        console.error("Error al agregar el ingrediente: ", data.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await removeIngrediente(id);
      console.log("Ingrediente eliminado:", response);
  
      // Actualiza la lista de ingredientes en el frontend
      setIngredientes((prevIngredientes) =>
        prevIngredientes.filter((ingrediente) => ingrediente.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el ingrediente:", error);
    }
  };

  return (
    <main className="container">
      <h1 className="titleInventario">Inventario de Ingredientes</h1>
      <div className="dashboard">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="form-container">
            <table className="form-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Fecha de Ingreso</th>
                  <th>Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={form.id}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      id="fechaIngreso"
                      name="fechaIngreso"
                      value={form.fechaIngreso}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      value={form.cantidad}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <button type="submit" className="action-button">Agregar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <h2>Lista de Ingredientes</h2>
        <table className="ingredient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha de Ingreso</th>
              <th>Cantidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ingrediente, index) => (
              <tr key={index}>
                <td>{ingrediente.id}</td>
                <td>{ingrediente.nombre}</td>
                <td>{ingrediente.fechaIngreso}</td>
                <td>{ingrediente.cantidad}</td>
                <td>
                  <button className="action-button" onClick={() => handleDelete(ingrediente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Ingrediente;
