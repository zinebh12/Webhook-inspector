"use client";

import { UseSearchContext } from "@/lib/search.context";

const SearchRequests = () => {
  const { search, setSearch } = UseSearchContext();

  const handleChange = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  return (
    <>
      <div className="relative">
        <input
          onChange={(e) => handleChange(e.target.value)}
          value={search}
          type="search"
          placeholder="Search Query"
          className={`w-full border-b border-b-input-border bg-input-background pl-1 py-1 text-sm text-input-text placeholder:text-input-placeholder outline-none transition focus:border-input-border-focus`}
        />
      </div>
    </>
  );
};

export default SearchRequests;
