
import { useState, useEffect } from 'react';
import { addIngrediente, getIngredientes, removeIngrediente, updateIngrediente } from '../services/ingrediente.service';
import '../styles/Inventario.css';


const Ingrediente = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    cantidad: ''
  });
  const [editMode, setEditMode] = useState(null); // Controla el ingrediente en modo edición
  const [newCantidad, setNewCantidad] = useState(''); // Nueva cantidad para edición


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
          nombre: '',
          fechaIngreso: new Date().toISOString().split('T')[0],
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

  const handleUpdate = async (id) => {
    try {
      const response = await updateIngrediente(id, newCantidad);
      if (response.status === 'Success') {
        setIngredientes((prevIngredientes) =>
          prevIngredientes.map((ingrediente) =>
            ingrediente.id === id ? { ...ingrediente, cantidad: newCantidad } : ingrediente
          )
        );
        setEditMode(null);
        setNewCantidad('');
      } else {
        console.error("Error al actualizar el ingrediente: ", response.message);
      }
    } catch (error) {
      console.error("Error al actualizar el ingrediente:", error);
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
                      disabled
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ingrediente) => (
              <tr key={ingrediente.id}>
                <td>{ingrediente.id}</td>
                <td>{ingrediente.nombre}</td>
                <td>{ingrediente.fechaIngreso}</td>
                <td>
                  {editMode === ingrediente.id ? (
                    <input
                      type="number"
                      className="edit-input"
                      value={newCantidad}
                      onChange={(e) => setNewCantidad(e.target.value)}
                    />
                  ) : (
                    ingrediente.cantidad
                  )}
                </td>
                <td>
                  {editMode === ingrediente.id ? (
                    <>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleUpdate(ingrediente.id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="action-button"
                        onClick={() => setEditMode(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="button-container">
                        <button
                          className="action-button edit-button"
                          onClick={() => {
                            setEditMode(ingrediente.id);
                            setNewCantidad(ingrediente.cantidad);
                          }}
                        >
                          Editar
                        </button>
                      </div>
                      <div className="button-container">
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDelete(ingrediente.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
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