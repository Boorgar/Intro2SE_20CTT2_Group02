import React from 'react';
import { Progress } from 'antd';

export default function SectionList({ sections, activeId, setActiveId }) {
  return (
    <>
      <p className="text-xl font-bold mt-4 mb-0">List of Sections</p>
      <div className="overflow-auto px-2">
        {sections.map(({ _id, name, totalSlots, products }) => (
          <div
            key={_id}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-slate-100 ${
              activeId === _id ? 'bg-slate-200' : ''
            }`}
            onClick={() => setActiveId(_id)}
          >
            <div className="w-2/3 font-bold truncate">{name}</div>
            <div className="w-80 px-4">
              <Progress
                percent={((products.length / totalSlots) * 100).toFixed(2)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
