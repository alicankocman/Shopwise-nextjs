'use client';

import { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
  };

  return (
    <div>
      <Header 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange} 
        onSort={handleSort} 
      />
      <MainContent 
        searchProducts={searchTerm}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
      />
      <Footer />
    </div>
  );
}