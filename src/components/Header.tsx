'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  onSearch: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  onSort: (sortOption: string) => void;
}

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: "Varsayılan", value: "default" },
  { label: "Fiyat (Artan)", value: "price-asc" },
  { label: "Fiyat (Azalan)", value: "price-desc" },
  { label: "İsim (A-Z)", value: "name-asc" },
  { label: "İsim (Z-A)", value: "name-desc" }
];

const Header: React.FC<Props> = ({ onSearch, onCategoryChange, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tüm Ürünler');
  const [selectedSort, setSelectedSort] = useState('Varsayılan');
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Tüm Ürünler",
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing"
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category === "Tüm Ürünler" ? "" : category);
    setShowCategoryDropdown(false);
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option.label);
    onSort(option.value);
    setShowSortDropdown(false);
  };

  return (
    <header className="flex justify-between items-center bg-white px-[80px] py-[25px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded-[10px] w-[98%] border-b border-[#cce5ff] relative h-[100px] mx-auto mt-4 md:flex-row md:h-[100px] flex-col md:items-center items-start">
      <div className="flex items-center gap-2">
      <Image 
          src="https://previews.123rf.com/images/ikalvi/ikalvi1712/ikalvi171200242/92412982-smiling-shopping-cart-vector-logo-design-shopping-mart-or-app-vector-logo.jpg"
          alt="shopping-cart"
          width={50}
          height={50}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold tracking-[-0.5px] bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mr-[200px] md:mb-0 mb-2.5">
          Shopping App
        </h1>
      </div>

      <div className="flex items-center gap-4 md:flex-row flex-col w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <input 
            type="text" 
            className="w-full md:w-[250px] px-[15px] py-[10px] text-sm border border-gray-300 rounded-lg mr-2.5 transition-all duration-300 focus:border-blue-500 focus:shadow-[0_0_5px_rgba(0,123,255,0.5)] focus:outline-none md:mb-0 mb-2.5"
            placeholder="Ürün Ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <button 
          onClick={handleSearch}
          className="bg-blue-600 text-white border-none px-[15px] py-[10px] rounded-lg text-sm cursor-pointer ml-2.5 transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-900 font-medium tracking-[0.3px] md:w-auto w-full md:mb-0 mb-2.5 mr-[150px]"
        >
          Ara
        </button>

        <div className="relative md:w-auto w-full" ref={categoryRef}>
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowSortDropdown(false);
            }}
            className="bg-blue-600 text-white border-none px-[15px] py-[10px] rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-900 font-medium md:w-auto w-full"
          >
            {selectedCategory}
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-[calc(100%+5px)] right-0 bg-white border border-gray-300 rounded-lg shadow-md z-[1000] min-w-[200px] animate-dropdownFade">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`px-5 py-3 cursor-pointer transition-colors duration-300 text-gray-700 text-sm hover:bg-gray-50 hover:text-blue-600
                    ${selectedCategory === category ? 'bg-gray-100 text-blue-600 font-medium' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative md:w-auto w-full" ref={sortRef}>
          <button
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowCategoryDropdown(false);
            }}
            className="bg-blue-600 text-white border-none px-[15px] py-[10px] rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-900 font-medium md:w-auto w-full"
          >
            {selectedSort}
          </button>
          {showSortDropdown && (
            <div className="absolute top-[calc(100%+5px)] right-0 bg-white border border-gray-300 rounded-lg shadow-md z-[1000] min-w-[200px] animate-dropdownFade">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-5 py-3 cursor-pointer transition-colors duration-300 text-gray-700 text-sm hover:bg-gray-50 hover:text-blue-600
                    ${selectedSort === option.label ? 'bg-gray-100 text-blue-600 font-medium' : ''}`}
                  onClick={() => handleSortSelect(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;