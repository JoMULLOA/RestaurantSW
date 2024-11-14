// pedido.jsx
import { useState, useEffect } from 'react';
import { addPedido, getPedidos, deletePedido } from '../services/pedido.service.js';
import '@styles/pedido.css';

const Pedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    mesa: '',
    plato: [],
    bebestible: [],
    postre: [],
    modificaciones: '',
    fechaIngreso: new Date().toISOString().split('T')[0]
  });
  const [inputValues, setInputValues] = useState({
    plato: '',
    bebestible: '',
    postre: ''
  });

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
        console.error("Error al conectar con el servidor: ", error);
      }
    };
    fetchPedidos();
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
      const data = await addPedido(form);
      if (data.status === 'Success') {
        setPedidos([...pedidos, data.data]);
        setForm({
          mesa: '',
          plato: [],
          bebestible: [],
          postre: [],
          modificaciones: '',
          fechaIngreso: new Date().toISOString().split('T')[0]
        });
      } else {
        console.error("Error al agregar el pedido: ", data.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deletePedido(id);
      if (data.status === 'Success') {
        setPedidos(pedidos.filter((pedido) => pedido.id !== id));
      } else {
        console.error("Error al eliminar el pedido: ", data.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
    }
  };

  return (
    <main className="container">
      <h1 className="titlePedido">📝 Registro de Pedido</h1>
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
                    <input
                      type="text"
                      id="mesa"
                      name="mesa"
                      value={form.mesa}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                  <div className="input-group">
                    <input
                        type="text"
                        id="plato"
                        name="plato"
                        value={inputValues.plato}
                        onChange={handleArrayInputChange}
                    />
                      <button type="button" onClick={() => handleAddToArray('plato')}>+</button>
                    </div>
                    <ul>
                      {form.plato.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                  <div className="input-group">
                    <input
                      type="text"
                      id="bebestible"
                      name="bebestible"
                      value={inputValues.bebestible}
                      onChange={handleArrayInputChange}
                    />
                      <button type="button" onClick={() => handleAddToArray('bebestible')}>+</button>
                    </div>
                    <ul>
                      {form.bebestible.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                  <div className="input-group">
                    <input
                      type="text"
                      id="postre"
                      name="postre"
                      value={inputValues.postre}
                      onChange={handleArrayInputChange}
                    />
                    <button type="button" onClick={() => handleAddToArray('postre')}>+</button>
                  </div>
                  <ul>
                    {form.postre.map((item, index) => (
                      <li key={index}>{item}</li>
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
            <th>ID</th>
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
                <td>{pedido.id}</td>
                <td>{pedido.mesa}</td>
                <td>{pedido.plato.join(', ')}</td>
                <td>{pedido.bebestible.join(', ')}</td>
                <td>{pedido.postre.join(', ')}</td>
                <td>{pedido.modificaciones}</td>
                <td>{pedido.fechaIngreso}</td>
                <td>
                  <button className="action-button" onClick={() => handleDelete(pedido.id)}>Eliminar</button>
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
