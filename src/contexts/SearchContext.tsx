import { createContext, ReactNode, useContext, useState } from "react";


type SearchContextProviderProps = {
    children: ReactNode
}

type SearchContextData = {
    podcast: string;
    setPodcast: (podcast: string) => void
}

export const SearchContext = createContext({} as SearchContextData);    

export function SearchContextProvider({children}: SearchContextProviderProps){

    const [podcast, setPodcast] = useState("")  
    
    return (
        <SearchContext.Provider
            value={{
                podcast,
                setPodcast
            }}>
            {children}
        </SearchContext.Provider>
        )
}

export const useSearch = () => useContext(SearchContext)