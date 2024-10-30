import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    // Condicional para añadir la clase `solo-chef` si el rol es solo 'chef'
    const navClass = `nav-menu ${menuOpen ? 'activado' : ''} ${userRole === 'chef' ? 'solo-chef' : ''}`;

    return (
        <nav className="navbar">
            <div className={navClass}>
                <ul>
                    <li>
                        <NavLink 
                            to="/home" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                        <>
                            <li>
                                <NavLink 
                                    to="/users" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    activeClassName="active"
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/Register" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                    }} 
                                    activeClassName="active"
                                >
                                    Registrar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/Inventario" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    activeClassName="active"
                                >
                                    Inventario
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/Mesas" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    activeClassName="active"
                                >
                                    Mesas
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'chef' && (
                    <>
                        <li>
                        <NavLink 
                            to="/Chef" 
                            onClick={() => { 
                            setMenuOpen(false); 
                            addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Chef
                        </NavLink>
                        </li>
                    </>
                    )}
                    {userRole === 'garzon' && (
                    <li>
                        <NavLink 
                            to="/Garzon" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Garzón
                        </NavLink>
                    </li>
                    )}
                    <li>
                        <NavLink 
                            to="/menu" 
                            onClick={() => { 
                                setMenuOpen(false); 
                            }} 
                            activeClassName="active"
                        >
                            Menú
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/auth" 
                            onClick={() => { 
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }} 
                            activeClassName="active"
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
