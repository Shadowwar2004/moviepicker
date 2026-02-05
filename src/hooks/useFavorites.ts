import { useState, useEffect } from "react";
import type {Movie} from "../types";


export const useFavorites = () => {
    // 1. On charge les favoris depuis le localStorage au démarrage
    const [favorites, setFavorites] = useState<Movie[]>(() => {
        const saved = localStorage.getItem("movieFavorites");
        return saved ? JSON.parse(saved) : [];
    });

    // 2. À chaque changement, on sauvegarde automatiquement
    useEffect(() => {
        localStorage.setItem("movieFavorites", JSON.stringify(favorites));
    }, [favorites]);

    // 3. Fonction pour ajouter/retirer
    const toggleFavorite = (e: React.MouseEvent, movie: Movie) => {
        e.stopPropagation(); // Empêche d'ouvrir la modale quand on clique sur le coeur

        const isAlreadyFav = favorites.some(fav => fav.id === movie.id);
        if (isAlreadyFav) {
            setFavorites(favorites.filter(fav => fav.id !== movie.id));
        } else {
            setFavorites([...favorites, movie]);
        }
    };

    // 4. Fonction pour vérifier si un film est favori
    const isFavorite = (movieId: number) => favorites.some(fav => fav.id === movieId);

    // On retourne ce dont le composant a besoin
    return { favorites, toggleFavorite, isFavorite };
};