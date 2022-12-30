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
    icon: 'uil:users-alt',
    route: '/workers',
  },
  {
    id: 2,
    icon: 'uil:package',
    route: '/sections',
  },
  {
    id: 3,
    icon: 'uil:truck',
    route: '/orders',
  },
  {
    id: 4,
    icon: 'uil:bell',
    route: '/notifications',
  },
  {
    id: 5,
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
