import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import StoragePage from './pages/StoragePage';
import UnderConstructionPage from './pages/UnderConstructionPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/storage',
        element: <StoragePage />,
      },
      {
        path: '/orders',
        element: <OrderPage />,
      },
      {
        path: '/notifications',
        element: <UnderConstructionPage />,
      },
      {
        path: '/settings',
        element: <UnderConstructionPage />,
      },
    ],
  },
]);

export default router;
