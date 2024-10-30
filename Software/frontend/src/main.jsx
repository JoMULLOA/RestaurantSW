import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Chef from '@pages/Chef';
import '@styles/styles.css';
import Inventario from '@pages/Inventario';
import Menu from '@pages/Menu';
import Pedido from '@pages/Pedido';
import Mesas from '@pages/Mesas'; // Importa el componente Mesas

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/menu',
        element: <Menu />
      },
      {
        path: '/chef',
        element: (
          <ProtectedRoute allowedRoles={['chef']}>
            <Chef />
          </ProtectedRoute>
        )
      },
      {
        path: '/pedido',
        element: (
          <ProtectedRoute allowedRoles={['garzon']}>
            <Pedido />
          </ProtectedRoute>
        )
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: '/inventario',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Inventario />
          </ProtectedRoute>
        )
      },
      {
        path: '/register',
        element: <Register />
      },
      // Nueva ruta para Mesas
      {
        path: '/mesas',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'garzon']}>
            <Mesas />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/auth',
    element: <Login />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
