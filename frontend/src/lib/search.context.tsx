"use client";

import { createContext, useContext, useState } from "react";

type SearchContextTypes = {
  search: string;
  setSearch: (value: string) => void;
};

const SearchContext = createContext<SearchContextTypes | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const UseSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }

  return context;
};
