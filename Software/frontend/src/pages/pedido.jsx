import { useState, useEffect } from 'react';
import { addPedido, getPedidos, deletePedido } from '../services/pedido.service.js';
import { obtenerMesas} from '../services/mesa.service.js';
import { getMenus } from '../services/menu.service.js';
import { actualizarGarzonMesa } from '../services/mesa.service.js';
import '@styles/pedido.css';
import AlertMessage from '../components/AlertMessage.jsx';

const Pedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({
    mesa: '',
    plato: [],
    bebestible: [],
    postre: [],
    modificaciones: '',
    fechaIngreso: new Date().toISOString().split('T')[0]
  });
  const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
  const userNombre = user?.nombreCompleto;
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [inputValues, setInputValues] = useState({
    plato: '',
    bebestible: '',
    postre: ''
  });

  useEffect(() => {
    if (alert.message) {
        const timer = setTimeout(() => {
            setAlert({ message: '', type: '' });
        }, 2000);

        return () => clearTimeout(timer);
    }
}, [alert]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        if (data.status === 'Success') {
          setPedidos(data.data);
        } else {
          console.error("Error al obtener los pedidos: ", data.message);
        }
      } catch (error) {
        setAlert({
          message: `Error al conectar con el servidor: ${error.message}`,
          type: 'error'
        });
      }
    };
    fetchPedidos();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        if (data.status === 'Success') {
          const bebestible = data.data.filter(menu => menu.tipo === 'Bebestible').map(menu => menu.nombre);
          const plato = data.data.filter(menu => menu.tipo === 'Plato').map(menu => menu.nombre);
          const postre = data.data.filter(menu => menu.tipo === 'Postre').map(menu => menu.nombre);
          setMenus({ bebestible, plato, postre });
        } else {
          console.error("Error al obtener los menús: ", data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor: ", error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const data = await obtenerMesas();
        const mesasDisponibles = data.filter(mesa => mesa.estado === 'Disponible');
        setMesas(mesasDisponibles);
      } catch (error) {
        console.error("Error al obtener las mesas: ", error);
      }
    };

    fetchMesas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const handleAddToArray = (field) => {
    if (!inputValues[field] || inputValues[field] === '') {
      setAlert({
        message: `Por favor seleccione un ${field} antes de agregar`,
        type: 'error'
      });
      return;
    }
    if (form[field].includes(inputValues[field])) {
      setAlert({
        message: `Este ${field} ya ha sido agregado`,
        type: 'error'
      });
      return;
    }
    setForm({
      ...form,
      [field]: [...form[field], inputValues[field]]
    });
    setInputValues({
      ...inputValues,
      [field]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Formulario', form);
      const data = await addPedido(form);
      if (data.status === 'Success') {
        await actualizarGarzonMesa(form.mesa, userNombre);
        setPedidos([...pedidos, data.data]);
        setForm({
          mesa: '',
          plato: [],
          bebestible: [],
          postre: [],
          modificaciones: '',
          fechaIngreso: new Date().toISOString().split('T')[0]
        });
        setAlert({
          message: 'Pedido agregado exitosamente',
          type: 'success'
        });
      } else {//Considerar
        const errorMessage = data.message || 'Error desconocido al agregar el pedido';
        setAlert({
          message: errorMessage,
          type: 'error'
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al conectar con el servidor';
      setAlert({
        message: errorMessage,
        type: 'error'
      });
    }

  };

  const handleDelete = async (req) => {
    try {
      const data = await deletePedido(req.id);
      if (data.status === 'Success') {
        setPedidos(pedidos.filter((pedido) => pedido.id !== req.id));
        console.log("Pedido eliminado correctamente");
      } else {
        console.error("Error al eliminar el pedido: ", data.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
    }
  };

  const handleRemoveFromArray = (field, index) => {
    setForm({
      ...form,
      [field]: form[field].filter((_, i) => i !== index),
    });
  };
  

  return (
    <main className="container">
      <h1 className="titlePedido">📝 Registro de Pedido</h1>
      {alert.message && <AlertMessage message={alert.message} type={alert.type} />}
      <div className="dashboard">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="form-container">
            <table className="form-table">
              <thead>
                <tr>
                  <th>Mesa</th>
                  <th>Plato</th>
                  <th>Bebestible</th>
                  <th>Postre</th>
                  <th>Modificaciones</th>
                  <th>Fecha de Ingreso</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                  <div className="input-group">
                    <select
                      id="mesa"
                      name="mesa"
                      value={form.mesa}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {mesas.map((mesa) => (
                        <option key={mesa.numeroMesa} value={mesa.numeroMesa}>
                          {mesa.numeroMesa}
                        </option>
                      ))}
                    </select>
                  </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <select
                        id="plato"
                        name="plato"
                        value={inputValues.plato}
                        onChange={handleArrayInputChange}
                      >
                        <option value="">Seleccionar</option>
                        {menus.plato && menus.plato.map((plato, index) => (
                          <option key={index} value={plato}>
                            {plato}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleAddToArray('plato')}>+</button>
                    </div>
                    <ul>
                    {form.plato.map((item, index) => (
                      <li key={index}>
                        {item}
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleRemoveFromArray('plato', index)}
                        >X
                        </button>
                      </li>
                    ))}
                  </ul>
                  </td>
                  <td>
                    <div className="input-group">
                    <select
                        id="bebestible"
                        name="bebestible"
                        value={inputValues.bebestible}
                        onChange={handleArrayInputChange}
                      >
                        <option value="">Seleccionar</option>
                        {menus.bebestible && menus.bebestible.map((bebestible, index) => (
                          <option key={index} value={bebestible}>
                            {bebestible}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleAddToArray('bebestible')}>+</button>
                    </div>
                    <ul>
                    {form.bebestible.map((item, index) => (
                      <li key={index}>
                        {item}
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleRemoveFromArray('bebestible', index)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  </td>
                  <td>
                    <div className="input-group">
                    <select
                        id="postre"
                        name="postre"
                        value={inputValues.postre}
                        onChange={handleArrayInputChange}
                      >
                        <option value="">Seleccionar</option>
                        {menus.postre && menus.postre.map((postre, index) => (
                          <option key={index} value={postre}>
                            {postre}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleAddToArray('postre')}>+</button>
                    </div>
                    <ul>
                    {form.postre.map((item, index) => (
                      <li key={index}>
                        {item}
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleRemoveFromArray('postre', index)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="modificaciones"
                      name="modificaciones"
                      value={form.modificaciones}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      id="fechaIngreso"
                      name="fechaIngreso"
                      value={form.fechaIngreso}
                      onChange={handleInputChange}
                      disabled
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
        <h2>Lista de Pedidos</h2>
        <table className="pedido-table">
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Plato</th>
              <th>Bebestible</th>
              <th>Postre</th>
              <th>Modificaciones</th>
              <th>Fecha de Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, index) => (
              <tr key={index}>
                <td>{pedido.mesa}</td>
                <td>{pedido.plato.join(', ')}</td>
                <td>{pedido.bebestible.join(', ')}</td>
                <td>{pedido.postre.join(', ')}</td>
                <td>{pedido.modificaciones}</td>
                <td>{pedido.fechaIngreso}</td>
                <td>
                  <button className="action-button" onClick={() => handleDelete(pedido)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Pedido;