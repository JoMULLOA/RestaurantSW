import '@styles/modalMesas.css'; // Asegúrate de crear este archivo de estilos para el modal

function ModalMesas({ onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Agregar Pedido a Mesa</h3>
                <form>
                    <div className="form-group">
                        <label>ID Pedido:</label>
                        <input type="text" placeholder="ID del pedido" />
                    </div>
                    <div className="form-group">
                        <label>Mesa:</label>
                        <input type="text" placeholder="Número de mesa" />
                    </div>
                    <div className="form-group">
                        <label>Garzón:</label>
                        <input type="text" placeholder="ID del garzón" />
                    </div>
                    <div className="form-group">
                        <label>Detalles del Pedido:</label>
                        <button type="button" onClick={() => console.log('Redirige a detalles del pedido')}>
                            Ver detalles
                        </button>
                    </div>
                    <button type="button" onClick={onClose} className="close-button">Cerrar</button>
                    <button type="submit" className="attend-button">Atender</button>
                </form>
            </div>
        </div>
    );
}

export default ModalMesas;
