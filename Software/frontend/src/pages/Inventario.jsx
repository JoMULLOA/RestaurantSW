import { useState, useEffect } from 'react';
import Search from '../components/Search';
import { addIngrediente, getIngredientes, removeIngrediente, updateIngrediente } from '../services/ingrediente.service';
import '../styles/inventario.css';

const Ingrediente = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    cantidad: ''
  });
  const [editMode, setEditMode] = useState(null);
  const [newCantidad, setNewCantidad] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [popupSearchTerm, setPopupSearchTerm] = useState('');
  const [showThresholdPopup, setShowThresholdPopup] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const itemsPerPage = 4;

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const LOW_QUANTITY_THRESHOLD = 5;

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const data = await getIngredientes();
        if (data.status === 'Success') {
          const ingredientesConPropiedades = data.data.map((ingrediente) => ({
            ...ingrediente,
            incluirEnAlerta: true,
            umbral: LOW_QUANTITY_THRESHOLD
          }));
          setIngredientes(ingredientesConPropiedades);
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
        setIngredientes([
          ...ingredientes,
          { ...data.data, incluirEnAlerta: true, umbral: LOW_QUANTITY_THRESHOLD }
        ]);
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
      if (response.status === 'Success') {
        setIngredientes((prevIngredientes) =>
          prevIngredientes.filter((ingrediente) => ingrediente.id !== id)
        );
      } else {
        console.error("Error al eliminar el ingrediente:", response.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
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

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const filteredIngredientes = ingredientes.filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popupFilteredIngredientes = ingredientes.filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(popupSearchTerm.toLowerCase())
  );

  const sortedIngredientes = [...filteredIngredientes].sort((a, b) => {
    const aValue = sortField === 'cantidad' ? parseFloat(a[sortField]) : a[sortField];
    const bValue = sortField === 'cantidad' ? parseFloat(b[sortField]) : b[sortField];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedIngredientes = sortedIngredientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lowQuantityIngredientes = ingredientes.filter(
    (ingrediente) =>
      ingrediente.incluirEnAlerta && parseFloat(ingrediente.cantidad) < ingrediente.umbral
  );

  const handleOpenThresholdPopup = () => setShowThresholdPopup(true);
  const handleCloseThresholdPopup = () => setShowThresholdPopup(false);

  const handleOpenAlertPopup = () => setShowAlertPopup(true);
  const handleCloseAlertPopup = () => setShowAlertPopup(false);

  return (
    <main className="container">
    <h1 className="titleInventario" style={{ marginTop: '90px' }}>Inventario de Ingredientes</h1>



      {showThresholdPopup && (
  <div className="popup-overlay">
    <div className="popup"
    style={{ maxHeight: '80vh' }}>
      <h3>Configuración de Umbrales</h3>
      <Search
        value={popupSearchTerm}
        onChange={(e) => setPopupSearchTerm(e.target.value)}
        placeholder="Buscar ingrediente"
      />
      <ul className="umbral-list">
        {popupFilteredIngredientes.map((ingrediente) => (
          <li key={ingrediente.id} className="umbral-item">
            <input
              type="number"
              value={ingrediente.umbral || LOW_QUANTITY_THRESHOLD}
              min="1"
              onChange={(e) =>
                setIngredientes((prevIngredientes) =>
                  prevIngredientes.map((item) =>
                    item.id === ingrediente.id
                      ? { ...item, umbral: parseFloat(e.target.value) }
                      : item
                  )
                )
              }
              className="umbral-input"
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={ingrediente.incluirEnAlerta}
                onChange={(e) =>
                  setIngredientes((prevIngredientes) =>
                    prevIngredientes.map((item) =>
                      item.id === ingrediente.id
                        ? { ...item, incluirEnAlerta: e.target.checked }
                        : item
                    )
                  )
                }
              />
              {ingrediente.nombre}
            </label>
          </li>
        ))}
      </ul>
      <button className="popup-button" onClick={handleCloseThresholdPopup}>
        Guardar y cerrar
      </button>

    </div>
  </div>
)}



      {showAlertPopup && (
        <div className="popup-overlay">
          <div className="popup"
          style={{ maxHeight: '60vh' }}>
            <h3>Ingredientes con Cantidad Baja</h3>
            {lowQuantityIngredientes.length > 0 ? (
              <ul>
                {lowQuantityIngredientes.map((ingrediente) => (
                  <li key={ingrediente.id}>
                    El ingrediente <strong>{ingrediente.nombre}</strong> tiene una cantidad baja: {ingrediente.cantidad}.
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay ingredientes por debajo del umbral configurado.</p>
            )}
            <button className="popup-button" onClick={handleCloseAlertPopup}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="dashboard">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="form-container">
            <table className="form-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha de Ingreso</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
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
                      min="1"
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
        <button onClick={handleOpenThresholdPopup} className="alert-button" style={{ marginLeft: '370px' }}>
          <i className="fas fa-cogs"></i>
        </button>
        <button onClick={handleOpenAlertPopup} className="alert-button" style={{ marginLeft: '30px' }}>
          <i className="fas fa-bell"></i>
        </button>
        <h2>Lista de Ingredientes</h2>
        <div className="search-container">
          <Search
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre de ingrediente"
          />
        </div>
        <table className="ingredient-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('nombre')}>
                Nombre {sortField === 'nombre' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : ''}
              </th>
              <th>Fecha de Ingreso</th>
              <th className="sortable" onClick={() => handleSort('cantidad')}>
                Cantidad {sortField === 'cantidad' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : ''}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIngredientes.map((ingrediente) => (
              <tr key={ingrediente.id}>
                <td>{ingrediente.nombre}</td>
                <td>{ingrediente.fechaIngreso}</td>
                <td>
                  {editMode === ingrediente.id ? (
                    <input
                      type="number"
                      className="edit-input"
                      value={newCantidad}
                      onChange={(e) => setNewCantidad(e.target.value)}
                      required
                      min="1"
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
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredIngredientes.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default Ingrediente;
