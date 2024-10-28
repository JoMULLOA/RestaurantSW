import { useState } from 'react';
import '../styles/Menu.css';

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const menuSections = {
        platos: [
            { name: 'Ensalada César', ingredients: ['Lechuga romana', 'Queso parmesano', 'Crutones', 'Aderezo César'] },
            { name: 'Pizza Margarita', ingredients: ['Masa de pizza', 'Salsa de tomate', 'Queso mozzarella', 'Albahaca fresca'] },
            { name: 'Sopa de Tomate', ingredients: ['Tomates', 'Ajo', 'Cebolla', 'Caldo de verduras', 'Aceite de oliva'] },
            { name: 'Pasta Alfredo', ingredients: ['Pasta fettuccine', 'Mantequilla', 'Crema', 'Queso parmesano'] },
            { name: 'Salchipapas', ingredients: ['Papas', 'Salchichas', 'Sal'] },
        ],
        bebestibles: [
            { name: 'Jugo de Naranja', ingredients: ['Naranjas frescas', 'Agua'] },
            { name: 'Limonada', ingredients: ['Limones frescos', 'Agua', 'Azúcar', 'Hielos'] },
            { name: 'Café', ingredients: ['Café molido', 'Agua caliente', 'Azúcar'] },
            { name: 'Té Verde', ingredients: ['Hojas de té verde', 'Agua caliente'] },
            { name: 'Coca-cola', ingredients: ['Coca-cola', 'Hielos'] },
        ],
        postres: [
            { name: 'Tiramisú', ingredients: ['Queso mascarpone', 'Café', 'Huevos', 'Azúcar', 'Cacao en polvo'] },
            { name: 'Helado de Vainilla', ingredients: ['Leche', 'Azúcar', 'Extracto de vainilla', 'Crema'] },
            { name: 'Cheesecake', ingredients: ['Queso crema', 'Galletas', 'Mantequilla', 'Azúcar'] },
            { name: 'Brownie', ingredients: ['Chocolate', 'Mantequilla', 'Azúcar', 'Harina', 'Huevos'] },
        ]
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="menu-container">
            <br />
            <br />
            <h2>Menú del Restaurante</h2>
            <div className="menu-sections">
                <div className="menu-section">
                    <h3>Platos</h3>
                    <ul className="menu-list">
                        {menuSections.platos.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="menu-section">
                    <h3>Bebestibles</h3>
                    <ul className="menu-list">
                        {menuSections.bebestibles.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="menu-section">
                    <h3>Postres</h3>
                    <ul className="menu-list">
                        {menuSections.postres.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {selectedItem && (
                <div className="selected-item-info">
                    <p>Seleccionaste: <strong>{selectedItem.name}</strong></p>
                    <h4 className="left-align">Sus ingredientes son:</h4>
                    <ul className="ingredients-list">
                        {selectedItem.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
