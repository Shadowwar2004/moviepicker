import { createContext, useState, useContext, type ReactNode } from "react";
import type {Movie} from "../types";

// Ce qu'on veut partager dans toute l'app
interface MovieContextType {
    movies: Movie[];
    setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    selectedGenre: number | string | null;
    setSelectedGenre: React.Dispatch<React.SetStateAction<number | string | null>>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
    // On déplace les états ici ! Ils ne seront plus détruits quand on change de page.
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState<number | string | null>(null);

    return (
        <MovieContext.Provider value={{
            movies, setMovies,
            searchTerm, setSearchTerm,
            page, setPage,
            selectedGenre, setSelectedGenre
        }}>
            {children}
        </MovieContext.Provider>
    );
};

// Hook pour utiliser le context facilement
export const useMovieContext = () => {
    const context = useContext(MovieContext);
    if (!context) throw new Error("useMovieContext must be used within a MovieProvider");
    return context;
};