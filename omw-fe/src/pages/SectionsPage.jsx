import React from 'react';
import Section from '../components/Section';
import SectionList from '../components/SectionList';
import Delivery from '../components/Delivery';

export default function SectionsPage({ sections }) {
  const [activeId, setActiveId] = React.useState(sections[0].id);
  const selectedSection = sections.find(({ id }) => activeId === id);
  return (
    <>
      <div className="grow shadow-xl p-4 flex flex-col justify-between">
        <Section name={selectedSection.name} slots={selectedSection.slots} />
        <SectionList
          sections={sections}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </div>
      <div className="p-4">
        <Delivery />
      </div>
    </>
  );
}
