import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Section from '../components/Section';
import SectionList from '../components/SectionList';
import SectionDetail from '../components/SectionDetail';

export default function StoragePage() {
  const [storage, setStorage] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const selectedSection = storage.find(({ _id }) => activeId === _id);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const response = await axios.get('http://localhost:3001/storage');
        setStorage(response.data);
        setActiveId(response.data[0]._id);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStorage();
    fetchProducts();
  }, []);

  return (
    <>
      <div className="w-3/4 p-4 flex flex-col justify-between">
        <Section selectedSection={selectedSection} products={products} />
        <SectionList
          sections={storage}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </div>
      <div className="p-4 shadow-sm w-50 overflow-auto">
        <SectionDetail selectedSection={selectedSection} products={products} />
      </div>
    </>
  );
}
