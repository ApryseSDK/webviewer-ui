import React, { createContext, useContext } from 'react';

export const SearchContext = createContext();

export const SearchWrapper = ({ children, keywords = [] }) => {
  const searchTerm = useContext(SearchContext).trim();

  return (!searchTerm || keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))) ? (
    <>
      {children}
    </>
  ) : null;
};
