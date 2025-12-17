import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

const SearchResults = () => {
  const { searchResults, showResults, isSearching, error } = useSearch();
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'PRODUCT':
        return 'ri-box-3-line';
      case 'STOCK':
        return 'ri-stack-line';
      case 'SALE':
        return 'ri-money-dollar-circle-line';
      case 'SUPPLIER':
        return 'ri-group-line';
      case 'USER':
        return 'ri-user-settings-line';
      default:
        return 'ri-search-line';
    }
  };

  const handleResultClick = (result) => {
    if (result.link) {
      navigate(result.link);
    }
  };

  if (!showResults) return null;

  return (
    <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
      {isSearching ? (
        <div className="p-4 text-center text-gray-500">
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Searching...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : searchResults.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No results found</div>
      ) : (
        <div className="py-2">
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleResultClick(result)}
            >
              <i className={`${getIcon(result.type)} mr-3 text-gray-500`}></i>
              <div>
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-gray-500">{result.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;