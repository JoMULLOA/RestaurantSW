import { useState, useEffect } from 'react';
import Search from '../components/Search';
import { addIngrediente, getIngredientes, removeIngrediente, updateIngrediente } from '../services/ingrediente.service';
import '../styles/inventario.css';
import AlertMessage from '../components/AlertMessage.jsx';

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
  const [alert, setAlert] = useState({ message: '', type: '' });

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
        setAlert({
          message: 'Ingrediente agregado exitosamente',
          type: 'success'
        });
      } 
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
      setAlert({
        message: error.response.data.message,
        type: 'error'
      });
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
    <h1 className="titleInventario" style={{ marginTop: '110px' }}>Inventario de Ingredientes</h1>
    {alert.message && <AlertMessage message={alert.message} type={alert.type} />}



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
                    <button type="submit" className="action-button edit-button">Agregar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <button onClick={handleOpenThresholdPopup} className="alert-button" style={{ marginLeft: '370px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.08-.98l2.11-1.65c.19-.14.24-.41.12-.61l-2-3.46c-.11-.2-.37-.27-.57-.2l-2.49 1a7.99 7.99 0 0 0-1.7-.98l-.38-2.65a.485.485 0 0 0-.48-.41h-4a.5.5 0 0 0-.49.41l-.38 2.65c-.63.23-1.2.53-1.7.89l-2.49-1c-.2-.08-.45 0-.57.2l-2 3.46c-.12.2-.07.47.12.61l2.11 1.65c-.05.32-.08.66-.08.99s.03.66.08.98l-2.11 1.65c-.19.14-.24.41-.12.61l2 3.46c.11.2.37.27.57.2l2.49-1c.5.37 1.07.68 1.7.89l.38 2.65c.05.22.24.41.49.41h4c.24 0 .44-.19.48-.41l.38-2.65c.63-.23 1.2-.53 1.7-.89l2.49 1c.2.08.45 0 .57-.2l2-3.46c.12-.2.07-.47-.12-.61l-2.1-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </svg>
        </button>
        <button onClick={handleOpenAlertPopup} className="alert-button" style={{ marginLeft: '30px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor">
            <path d="M224 512c35.3 0 64-28.7 64-64H160c0 35.3 28.7 64 64 64zm215.4-149.3c-20.9-21.6-55.4-52.6-55.4-154.7 0-77.7-54.5-139.3-127.1-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v20.8C118.5 68.7 64 130.3 64 208c0 102.1-34.5 133.1-55.4 154.7-6 6.2-8.6 14.6-8.6 22.3 0 16.6 13.4 32 32 32h384c18.6 0 32-15.4 32-32 0-7.7-2.6-16.1-8.6-22.3z"/>
          </svg>
        </button>
        <h2 style={{ marginLeft: '50px' }}>Lista de Ingredientes</h2>
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
                        style={{ marginRight: '10px' }}
                      >
                        Guardar
                      </button>
                      <button
                        className="action-button edit-button"
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
                          className="action-button edit-button"
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
