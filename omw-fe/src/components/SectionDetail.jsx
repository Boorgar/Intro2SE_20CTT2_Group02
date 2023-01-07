import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const navItems = [
  { id: 0, text: 'New' },
  { id: 1, text: 'Processing' },
  { id: 2, text: 'Sent' },
];

export default function SectionDetail({ selectedSection, products }) {
  const [activeId, setActiveId] = useState(navItems[0].id);
  const activeNavItem = navItems.find(({ id }) => id === activeId);
  const sectionProducts = selectedSection ? selectedSection.products : [];
  return (
    <>
      <div className="flex gap-16 justify-center">
        {navItems.map(({ id, text }) => (
          <div
            key={id}
            className={`${
              activeId === id ? 'bg-slate-200' : ''
            } cursor-pointer font-bold p-2 rounded-lg`}
            onClick={() => setActiveId(id)}
          >
            {text}
          </div>
        ))}
      </div>
      {sectionProducts
        .filter(({ status }) => status === activeNavItem.text)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map(({ _id, updatedAt }, index) => (
          <Item
            key={index}
            name={products.find((product) => product._id === _id)?.name}
            updatedAt={updatedAt}
          />
        ))}
    </>
  );
}

function Item({ name, updatedAt }) {
  return (
    <div className="my-4 flex gap-4">
      <div className="h-12 w-12 rounded-xl bg-slate-400 flex items-center justify-center">
        <Icon icon="uil:box" className="text-3xl text-white" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="w-72 font-bold truncate">{name}</div>
        <div className="text-sm">{new Date(updatedAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
