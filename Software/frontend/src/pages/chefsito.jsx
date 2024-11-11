import { useState, useEffect } from 'react';

import { getPedidos } from '../services/pedido.service.js';

const Chefsito = () => {
    const [pedidos, setPedidos] = useState([]);
    const [datosRecibidos, setDatosRecibidos] = useState(null);
    console.log('Datos recibidos:', datosRecibidos);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const data = await getPedidos();
            setDatosRecibidos(data);
            setPedidos(data.data || []); // Asegurando que los pedidos estén en `data.data`
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

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Chefsito</h1>
            
            <div className="pedidos-ventana" style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '600px',
                margin: '20px auto',
                backgroundColor: '#f9f9f9'
            }}>
                <h2 style={{ textAlign: 'center' }}>Pedidos Pendientes</h2>
                {Array.isArray(pedidos) && pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                        <div key={pedido.id} style={{
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            padding: '12px',
                            margin: '12px 0',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
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
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <h2>Detalles del Pedido</h2>
                        <p><strong>Mesa:</strong> {pedidoSeleccionado.mesa}</p>
                        <p><strong>Plato:</strong> {pedidoSeleccionado.plato.join(', ')}</p>
                        <p><strong>Bebestible:</strong> {pedidoSeleccionado.bebestible.join(', ')}</p>
                        <p><strong>Postre:</strong> {pedidoSeleccionado.postre.join(', ')}</p>
                        <p><strong>Modificaciones:</strong> {pedidoSeleccionado.modificaciones}</p>
                        <p><strong>Fecha de Ingreso:</strong> {pedidoSeleccionado.fechaIngreso}</p>
                        <button 
                            onClick={cerrarDetallesPedido}
                            style={{
                                backgroundColor: '#d9534f',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Chefsito;
