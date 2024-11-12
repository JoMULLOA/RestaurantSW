import { useState, useEffect } from 'react';
import { getPedidos } from '../services/pedido.service.js';
import { prepararPedido } from '../services/chefsito.service.js';
import '../styles/chefsito.css';

const Chefsito = () => {
    const [pedidos, setPedidos] = useState([]);
    const [datosRecibidos, setDatosRecibidos] = useState(null);
    console.log("datosRecibidos:",datosRecibidos);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const data = await getPedidos();
            setDatosRecibidos(data);
            setPedidos(data.data || []);
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
            await prepararPedido(pedidoSeleccionado);
            await cargarPedidos();
        } catch (error) {
            console.error('Error al preparar el pedido:', error);
        }
    };

    return (
        <div>
            <h1>Chefsito</h1>
            
            <div className="pedidos-ventana">
                <h2>Pedidos Pendientes</h2>
                {Array.isArray(pedidos) && pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
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
                        <button 
                            onClick={cerrarDetallesPedido}
                            className="button button-close"
                        >
                            Cerrar
                        </button>
                        <button 
                            onClick={manejarPreparacionPedido}
                            className="button button-preparar"
                        >
                            Preparar Pedido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chefsito;
