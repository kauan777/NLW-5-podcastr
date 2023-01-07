import { createContext, ReactNode, useContext, useState } from "react";

type SearchContextProviderProps = {
  children: ReactNode;
};

type SearchContextData = {
  titlePodcast: string;
  setTitlePodcast: (podcast: string) => void;
};

export const SearchContext = createContext({} as SearchContextData);

export function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const [titlePodcast, setTitlePodcast] = useState("");

  return (
    <SearchContext.Provider
      value={{
        titlePodcast,
        setTitlePodcast,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
