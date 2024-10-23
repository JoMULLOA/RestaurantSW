// src/pages/Inventario.jsx
import { useState } from 'react';
import '@styles/inventario.css';

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({
        id: '',
        fechaIngreso: '',
        cantidad: '',
        tipoProducto: '',
        nombre: '',
        imagen: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProductos([...productos, form]);
        setForm({
            id: '',
            fechaIngreso: '',
            cantidad: '',
            tipoProducto: '',
            nombre: '',
            imagen: ''
        });
    };

    return (
        <main className="container">
            <h1 className="title">Inventario</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={form.id}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fechaIngreso">Fecha de Ingreso:</label>
                    <input
                        type="date"
                        id="fechaIngreso"
                        name="fechaIngreso"
                        value={form.fechaIngreso}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cantidad">Cantidad:</label>
                    <input
                        type="number"
                        id="cantidad"
                        name="cantidad"
                        value={form.cantidad}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tipoProducto">Tipo de Producto:</label>
                    <input
                        type="text"
                        id="tipoProducto"
                        name="tipoProducto"
                        value={form.tipoProducto}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imagen">Imagen (URL):</label>
                    <input
                        type="text"
                        id="imagen"
                        name="imagen"
                        value={form.imagen}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Agregar Producto</button>
            </form>
            <h2>Lista de Productos</h2>
            <ul className="product-list">
                {productos.map((producto, index) => (
                    <li key={index} className="product-item">
                        <div className="product-info">
                            <p>ID: {producto.id}</p>
                            <p>Fecha de Ingreso: {producto.fechaIngreso}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                            <p>Tipo de Producto: {producto.tipoProducto}</p>
                            <p>Nombre: {producto.nombre}</p>
                            <img src={producto.imagen} alt={producto.nombre} width="100" />
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default Inventario;