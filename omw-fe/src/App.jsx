import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const navItems = [
  {
    id: 0,
    icon: 'uil:home-alt',
    route: '/',
  },
  {
    id: 1,
    icon: 'uil:package',
    route: '/storage',
  },
  {
    id: 2,
    icon: 'uil:truck',
    route: '/orders',
  },
  {
    id: 3,
    icon: 'uil:bell',
    route: '/notifications',
  },
  {
    id: 4,
    icon: 'uil:setting',
    route: '/settings',
  },
];

const App = () => {
  return (
    <div className="flex h-screen">
      <Navigation navItems={navItems} />
      <Outlet />
    </div>
  );
};

export default App;
