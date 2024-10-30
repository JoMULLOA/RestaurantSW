// pedido.jsx
import { useState, useEffect } from 'react';
import { addPedido, getPedidos, deletePedido } from '../services/pedido.service.js';
import '@styles/pedido.css';

const Pedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    id: '',
    mesa: '',
    plato: '',
    bebestible: '',
    postre: '',
    modificaciones: '',
    fechaIngreso: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await addPedido(form);
      if (data.status === 'Success') {
        setPedidos([...pedidos, data.data]);
        setForm({
          id: '',
          mesa: '',
          plato: '',
          bebestible: '',
          postre: '',
          modificaciones: '',
          fechaIngreso: ''
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
      <h1 className="titleInventario">Registro de Pedido</h1>
      <div className="dashboard">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="form-container">
            <table className="form-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                      id="mesa"
                      name="mesa"
                      value={form.mesa}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="plato"
                      name="plato"
                      value={form.plato}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="bebestible"
                      name="bebestible"
                      value={form.bebestible}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="postre"
                      name="postre"
                      value={form.postre}
                      onChange={handleInputChange}
                      required
                    />
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
                <td>{pedido.plato}</td>
                <td>{pedido.bebestible}</td>
                <td>{pedido.postre}</td>
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
