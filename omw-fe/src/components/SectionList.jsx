import React from 'react';
import { Progress } from 'antd';

export default function SectionList({ sections, activeId, setActiveId }) {
  return (
    <>
      <h2 className="text-xl font-bold">List of sections</h2>
      <div className="overflow-auto">
        {sections.map(({ id, name, used, received, sent, expected }) => (
          <div
            key={id}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${
              activeId === id ? 'bg-emerald-100' : ''
            }`}
            onClick={() => setActiveId(id)}
          >
            <div className="font-bold">{name}</div>
            <div className="flex w-80 gap-4">
              <div>Used</div>
              <Progress percent={used} />
            </div>
            <div>{received} received</div>
            <div>{sent} sent</div>
            <div>{expected} expected</div>
          </div>
        ))}
      </div>
    </>
  );
}
