import React from 'react';
import Slot from './Slot';

export default function Section({ selectedSection, products }) {
  const name = selectedSection ? selectedSection.name : '';
  const sectionProducts = selectedSection ? selectedSection.products : [];
  const totalSlots = selectedSection ? selectedSection.totalSlots : 0;
  return (
    <div className="flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <div className={`flex flex-wrap gap-4 justify-start p-4`}>
          {Array.from(Array(Math.abs(totalSlots))).map((_, index) => {
            const sectionProduct = sectionProducts.find(
              ({ slotIndex }) => slotIndex === index + 1
            );
            return sectionProduct ? (
              <Slot
                key={sectionProduct._id}
                isLoaded={true}
                status={sectionProduct.status}
                slotDetail={products.find(
                  (product) => product._id === sectionProduct._id
                )}
              />
            ) : (
              <Slot key={index} slotDetail={null} isLoaded={false} />
            );
          })}
        </div>
      </div>
      <div className="flex p-4 gap-20">
        <div className="flex items-center gap-2">
          <Slot isLoaded={true} /> {sectionProducts.length} loaded shelves
        </div>
        <div className="flex items-center gap-2">
          <Slot isLoaded={false} /> {totalSlots - sectionProducts.length} empty
          shelves
        </div>
      </div>
    </div>
  );
}
