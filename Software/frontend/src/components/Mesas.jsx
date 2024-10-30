import '@styles/mesas.css'; // Asegúrate de crear este archivo de estilos para el componente

function Mesas() {
    return (
        <div className="mesas-container">
            <h2>Gestión de Mesas</h2>
            <form className="mesas-form">
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
                <button type="submit" className="attend-button">Atender</button>
            </form>
        </div>
    );
}

export default Mesas;