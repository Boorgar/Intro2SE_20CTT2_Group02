import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation({ navItems }) {
  const location = useLocation();
  const [activeId, setActiveId] = useState(location.pathname);
  return (
    <>
      <div className="shadow-xl w-20 flex flex-col items-center justify-center h-full bg-slate-200 gap-4">
        {navItems.map(({ id, icon, route }) => (
          <Link key={id} to={route}>
            <div
              className={`${
                activeId === route ? 'bg-slate-50' : ''
              } hover:bg-slate-50 w-14 h-14 flex items-center justify-center rounded-xl cursor-pointer`}
              onClick={() => setActiveId(route)}
            >
              <Icon
                icon={icon}
                className={`text-4xl ${
                  activeId === route ? 'text-slate-600' : 'text-slate-300'
                }`}
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
