// Ingrediente.jsx
import { useState } from 'react';
import { addIngrediente } from '../services/ingrediente.service.js';

import '@styles/inventario.css';

const Ingrediente = () => {
    const [ingredientes, setIngredientes] = useState([]);
    const [form, setForm] = useState({
        id: '',
        nombre: '',
        fechaIngreso: '',
        cantidad: ''
    });

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
            const data = await addIngrediente(form);
            if (data.status === 'Success') {
                setIngredientes([...ingredientes, data.data]);
                setForm({
                    id: '',
                    nombre: '',
                    fechaIngreso: '',
                    cantidad: ''
                });
            } else {
                console.error("Error al agregar el ingrediente: ", data.message);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor: ", error);
        }
    };

    return (
        <main className="container">
            <h1 className="titleInventario">Inventario de Ingredientes</h1>
            <div className="dashboard">
                <div className="form-wrapper">
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
                        <button type="submit">Agregar Ingrediente</button>
                    </form>
                </div>
                <h2>Lista de Ingredientes</h2>
                <table className="ingredient-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fecha de Ingreso</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientes.map((ingrediente, index) => (
                            <tr key={index}>
                                <td>{ingrediente.id}</td>
                                <td>{ingrediente.nombre}</td>
                                <td>{ingrediente.fechaIngreso}</td>
                                <td>{ingrediente.cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default Ingrediente;
