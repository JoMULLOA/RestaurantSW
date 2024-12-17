import { useState, useEffect } from 'react';
import { getPedidos, removePedido} from '../services/pedido.service.js';
import { prepararPedido, CancelarPedido } from '../services/chefsito.service.js';

import '../styles/chefsito.css';

const Chefsito = () => {
    const [pedidos, setPedidos] = useState([]);
    const [datosRecibidos, setDatosRecibidos] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    
    //const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    //const NombreS = user?.nombreCompleto;
    
    
    console.log(datosRecibidos)
    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const data = await getPedidos();
            setDatosRecibidos(data);
    
            // Mapear el estado numérico a texto legible
            const pedidosConEstado = data.data.map((pedido) => ({
                ...pedido,
                status: pedido.Estado === 0 
                    ? 'Pendiente' 
                    : pedido.Estado === 1 
                    ? 'En Preparación' 
                    : 'Pedido Listo', // Mapeamos los estados
            }));
            setPedidos(pedidosConEstado);
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
            const pedidoActualizado = await prepararPedido(pedidoSeleccionado.id); // Solo enviar el ID
            console.log(pedidoActualizado);
            // Actualiza el estado local
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === pedidoSeleccionado.id
                        ? { ...pedido, status: 'En Preparación', Estado: 1 }
                        : pedido
                )
            );
            cerrarDetallesPedido();
        } catch (error) {
            console.error('Error al preparar el pedido:', error);
        }
    };
    
    

    const CancelarelPedido = async (pedido) => {
        try {
            await CancelarPedido(pedido);
            
            // Actualizar el estado del pedido a "Cancelado"
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) => 
                    pedido.id === pedidoSeleccionado.id
                    ? { ...pedido, status: 'Cancelado', Estado: -1 } // Estado -1 para cancelar
                    : pedido
                )
            );
            cerrarDetallesPedido();
        } catch (error) {
            console.error('Error al cancelar el pedido:', error);
        }
    };
    const pedidolisto = async () => {
        try {
            const pedidoActualizado = await prepararPedido(pedidoSeleccionado.id);
            console.log(pedidoActualizado)
            // Actualiza el estado local
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === pedidoSeleccionado.id
                        ? { ...pedido, status: 'Pedido Listo', Estado: 2 } // Actualizamos el status y el Estado
                        : pedido
                )
            );
            cerrarDetallesPedido();
        } catch (error) {
            console.error('Error al preparar el pedido:', error);
        }
    };

    const Pedidoterminado = async () => {
        try {
            const pedidoActualizado = await prepararPedido(pedidoSeleccionado.id);
            console.log('Pedido actualizado:', pedidoActualizado);
            console.log('ID del pedido a eliminar:', pedidoSeleccionado.id);
            removePedido(pedidoSeleccionado.id);
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === pedidoSeleccionado.id
                        ? { ...pedido, status: 'Pedido Listo', Estado: -1 } // Actualizamos el status y el Estado
                        : pedido
                )
            );
            cerrarDetallesPedido();
        } catch (error) {
            console.error('Error al terminar el pedido:', error);
        }
    };

    // Filtramos los pedidos por estado
    const pedidosPendientes = pedidos.filter((pedido) => pedido.Estado === 0);
    const pedidosEnPreparacion = pedidos.filter((pedido) => pedido.Estado === 1);
    const PedidosListos = pedidos.filter((pedido) => pedido.Estado === 2);

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
                <div className="pedidos-seccion">
                    <div className="pedidos-ventana">
                        <h2>Pedidos Listos</h2>
                        {PedidosListos.length > 0 ? (
                            PedidosListos.map((pedido) => (
                                <div key={pedido.mesa}
                                    className="pedido-card"
                                    onClick={() => mostrarDetallesPedido(pedido)}>
                                    
                                    <h3>Mesa #{pedido.mesa}</h3>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#555' }}>No hay pedidos listos</p>
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
                        {pedidoSeleccionado.status === 'Pendiente' && (
                            <button onClick={manejarPreparacionPedido} className="button button-preparar">
                            Preparar Pedido
                            </button>
                        )}
                        {pedidoSeleccionado.status === 'En Preparación' && (
                            <button onClick={pedidolisto} className="button button-preparar">
                                Pedido Listo
                            </button>
                        )}
                        {pedidoSeleccionado.status === 'Pedido Listo' && (
                            <button onClick={() => Pedidoterminado(pedidoSeleccionado)} className="button button-preparar">
                                Terminar Pedido
                            </button>
                        )}  
                        {pedidoSeleccionado.status === 'Pendiente' && (                       
                            <button onClick={() => CancelarelPedido(pedidoSeleccionado)} className="button button-cancelar">
                                Cancelar Pedido
                            </button>
                        )}
                        {pedidoSeleccionado.status === 'En Preparación' && (                       
                            <button onClick={() => CancelarelPedido(pedidoSeleccionado)} className="button button-cancelar">
                                Cancelar Pedido
                            </button>
                        )}

                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Chefsito;
