import { useState } from 'react';
import '../styles/Garzon.css';

const Garzon = () => {
  const [pedidos, setPedidos] = useState([]);
  const [nuevoPedido, setNuevoPedido] = useState({
    mesa: '',
    nombre: '',
    plato: '',
    bebestibles: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPedido({ ...nuevoPedido, [name]: value });
  };

  const agregarPedido = (e) => {
    e.preventDefault();
    const platoArray = nuevoPedido.plato.split(',').map((ing) => ing.trim());
    const nuevoId = pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1;
    setPedidos([
      ...pedidos,
      {
        id: nuevoId,
        mesa: nuevoPedido.mesa,
        nombre: nuevoPedido.nombre,
        plato: platoArray,
        estado: 'En Espera',
      },
    ]);
    setNuevoPedido({ mesa: '', nombre: '', plato: '' });
  };

  const verificarInventario = (pedidoId) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId
          ? {
              ...pedido,
              estado:
                pedido.plato.includes('Tomate') &&
                pedido.plato.includes('Lechuga') &&
                pedido.plato.includes('zanahoria')
                  ? 'Preparacion'
                  : 'Falta de plato',
            }
          : pedido
      )
    );
  };

  const actualizarEstado = (pedidoId, nuevoEstado) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  };

  return (
    <div className="container">
      <form onSubmit={agregarPedido}>
        <h1>Registrar</h1>
        <h1>pedido</h1>
        <div>
          <label>Mesa:</label>
          <input
            type="text"
            name="mesa"
            value={nuevoPedido.mesa}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={nuevoPedido.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Plato(s):</label>
          <input
            type="text"
            name="plato"
            value={nuevoPedido.plato}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Bebestible(s):</label>
          <input
            type="text"
            name="bebestibles"
            value={nuevoPedido.bebestibles}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>

      <div className="sections">
        <div className="section">
          <h2>En Espera</h2>
          {pedidos
            .filter((pedido) => pedido.estado === 'En Espera')
            .map((pedido) => (
              <div key={pedido.id}>
                <p><strong>Mesa:</strong> {pedido.mesa}</p>
                <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
                <p><strong>plato:</strong> {pedido.plato.join(', ')}</p>
                <button onClick={() => verificarInventario(pedido.id)}>Verificar Inventario</button>
              </div>
            ))}
        </div>

        <div className="section">
          <h2>Preparacion</h2>
          {pedidos
            .filter((pedido) => pedido.estado === 'Preparacion')
            .map((pedido) => (
              <div key={pedido.id}>
                <p><strong>Mesa:</strong> {pedido.mesa}</p>
                <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
                <button onClick={() => actualizarEstado(pedido.id, 'Entrega')}>Actualizar a Entrega</button>
              </div>
            ))}
        </div>

        <div className="section">
          <h2>Falta de ingredientes</h2>
          {pedidos
            .filter((pedido) => pedido.estado === 'Falta de plato')
            .map((pedido) => (
              <div key={pedido.id}>
                <p><strong>Mesa:</strong> {pedido.mesa}</p>
                <p><strong>Pedido a nombre de:</strong> {pedido.nombre}</p>
                <p className="red">Falta de ingredientes para plato</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Garzon;