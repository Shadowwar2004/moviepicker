import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { useMovieContext } from "../context/MovieContext"; // On importe le hook du context

const API_KEY = import.meta.env.VITE_API_KEY;

export const useMovies = () => {
    // Au lieu de useState(), on utilise le context !
    const {
        movies, setMovies,
        searchTerm, setSearchTerm,
        page, setPage,
        selectedGenre, setSelectedGenre
    } = useMovieContext();

    const [isLoading, setIsLoading] = useState(false);

    // Le debounce reste local car c'est un outil temporaire
    const debouncedSearch = useDebounce(searchTerm, 500);

    const fetchMovies = async (isLoadMore = false) => {
        // Empêcher de recharger si on a déjà des données et qu'on revient sur la page 1 (Sauf si recherche change)
        if (!isLoadMore && page === 1 && movies.length > 0 && !debouncedSearch && !selectedGenre) {
            // Astuce : Si on revient sur Home et qu'on a déjà des films, on ne refetch pas tout de suite
            // Mais attention, pour la recherche ça peut être tricky.
            // Pour faire simple : on laisse le fetch se faire, React est rapide.
        }

        if (!isLoadMore) setIsLoading(true);

        const currentPage = isLoadMore ? page : 1;

        let url = "";
        const baseParams = `api_key=${API_KEY}&page=${currentPage}&language=fr-FR&sort_by=popularity.desc`;

        if (debouncedSearch) {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${debouncedSearch}&page=${currentPage}&language=fr-FR`;
        } else if (selectedGenre === "anime") {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}&with_genres=16&with_original_language=ja`;
        } else if (typeof selectedGenre === 'number') {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}&with_genres=${selectedGenre}`;
        } else {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();
            const results = data.results || [];

            if (isLoadMore) {
                // On évite les doublons (par sécurité)
                setMovies((prev) => {
                    const newIds = new Set(results.map((m: any) => m.id));
                    return [...prev, ...results.filter((m: any) => !newIds.has(m.id))];
                });
            } else {
                setMovies(results);
            }
        } catch (error) {
            console.error("Erreur fetch:", error);
            if (!isLoadMore) setMovies([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination
    useEffect(() => {
        if (page > 1) fetchMovies(true);
    }, [page]);

    // Recherche & Filtres

    useEffect(() => {

        if (page !== 1) setPage(1);
        fetchMovies(false);
    }, [debouncedSearch, selectedGenre]);

    return {
        movies,
        isLoading,
        searchTerm, setSearchTerm,
        selectedGenre, setSelectedGenre,
        page, setPage,
    };
};