import { useState, useEffect } from 'react';
import { getPedidos } from '../services/pedido.service.js';
import { prepararPedido } from '../services/chefsito.service.js';
import '../styles/chefsito.css';

const Chefsito = () => {
    const [pedidos, setPedidos] = useState([]);
    const [datosRecibidos, setDatosRecibidos] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    console.log(datosRecibidos)
    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const data = await getPedidos();
            setDatosRecibidos(data);
            // Inicializamos los pedidos con un status "Pendiente"
            const pedidosConStatus = data.data.map((pedido) => ({
                ...pedido,
                status: 'Pendiente', // Agregamos un estado inicial
            }));
            setPedidos(pedidosConStatus);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            setPedidos([]);
        }
    };

    const mostrarDetallesPedido = (pedido) => {
        setPedidoSeleccionado(pedido);
    };

    const cerrarDetallesPedido = () => {
        setPedidoSeleccionado(null);
    };

    const manejarPreparacionPedido = async () => {
        try {
            
            // Actualizamos el pedido como "En Preparación"
            const pedidoActualizado = {
                ...pedidoSeleccionado,
                status: 'En Preparación',
            };

            // Actualizamos el estado global de los pedidos
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.mesa === pedidoActualizado.mesa ? pedidoActualizado : pedido
                )
            );

            // Simulamos la actualización en el servidor
            await prepararPedido(pedidoActualizado);
            cerrarDetallesPedido();
        } catch (error) {
            console.error('Error al preparar el pedido:', error);
        }
    };

    // Filtramos los pedidos por estado
    const pedidosPendientes = pedidos.filter((pedido) => pedido.status === 'Pendiente');
    const pedidosEnPreparacion = pedidos.filter((pedido) => pedido.status === 'En Preparación');

    return (
        <div>
            <h1>Chefsito</h1>
            <div className="pedidos-container">
                <div className="pedidos-seccion">
                    <div className="pedidos-ventana">
                        <h2>Pedidos Pendientes</h2>
                        {pedidosPendientes.length > 0 ? (
                            pedidosPendientes.map((pedido) => (
                                <div
                                    key={pedido.mesa}
                                    className="pedido-card"
                                    onClick={() => mostrarDetallesPedido(pedido)}
                                >
                                    <h3>Mesa #{pedido.mesa}</h3>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#555' }}>No hay pedidos pendientes</p>
                        )}
                    </div>
                </div>
                <div className="pedidos-seccion">
                    <div className="pedidos-ventana">
                        <h2>Pedidos En Preparación</h2>
                        {pedidosEnPreparacion.length > 0 ? (
                            pedidosEnPreparacion.map((pedido) => (
                                <div key={pedido.mesa}
                                    className="pedido-card"
                                    onClick={() => mostrarDetallesPedido(pedido)}>
                                    
                                    <h3>Mesa #{pedido.mesa}</h3>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#555' }}>No hay pedidos en preparación</p>
                        )}
                    </div>
                </div>
            </div>
            {pedidoSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Detalles del Pedido</h2>
                        <p><strong>Mesa:</strong> {pedidoSeleccionado.mesa}</p>
                        <p><strong>Plato:</strong> {pedidoSeleccionado.plato.join(', ')}</p>
                        <p><strong>Bebestible:</strong> {pedidoSeleccionado.bebestible.join(', ')}</p>
                        <p><strong>Postre:</strong> {pedidoSeleccionado.postre.join(', ')}</p>
                        <p><strong>Modificaciones:</strong> {pedidoSeleccionado.modificaciones}</p>
                        <p><strong>Fecha de Ingreso:</strong> {pedidoSeleccionado.fechaIngreso}</p>
                        <button onClick={cerrarDetallesPedido} className="button button-close">
                            Cerrar
                        </button>
                        <button onClick={manejarPreparacionPedido} className="button button-preparar">
                            Preparar Pedido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chefsito;
