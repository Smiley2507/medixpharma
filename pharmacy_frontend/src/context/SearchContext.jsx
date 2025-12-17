import React, { createContext, useContext, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import api from '../utils/axiosConfig';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const performSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowResults(false);
        setError('');
        return;
      }

      setIsSearching(true);
      try {
        const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setSearchResults(response.data);
        setShowResults(true);
        setError('');
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
        setShowResults(false);
        setError(err.response?.data?.message || 'Failed to perform search');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError('');
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        showResults,
        setShowResults,
        performSearch,
        clearSearch,
        error,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};