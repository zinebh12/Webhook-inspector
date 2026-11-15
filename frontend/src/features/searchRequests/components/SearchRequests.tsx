"use client";

import { useState, useEffect } from "react";

import { useSearch } from "../hooks/use-search.hook";

import { useSearchParams } from "next/navigation";

const SearchRequests = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("endpoint");

  const [search, setSearch] = useState("");

  const { data: requests } = useSearch(id, search);

  const handleChange = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  useEffect(() => {
    console.log(requests?.data);
  }, [requests]);
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
