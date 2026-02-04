import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";


interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    overview: string;
}

const Favorites = () => {
    const [favMovies, setFavMovies] = useState<Movie[]>([]);

    // 1. Au chargement, on récupère les films stockés
    useEffect(() => {
        const saved = localStorage.getItem("movieFavorites");
        if (saved) {
            setFavMovies(JSON.parse(saved));
        }
    }, []);


    const removeFavorite = (e: React.MouseEvent, movieId: number) => {
        e.stopPropagation();


        const newFavorites = favMovies.filter((movie) => movie.id !== movieId);

        setFavMovies(newFavorites);


        localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
    };

    return (
        <div className="pb-20 pt-4">
            <h2 className="text-3xl font-bold mb-8 text-white border-l-4 border-purple-500 pl-4">
                Mes Films Favoris ❤️
            </h2>

            {favMovies.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <span className="text-6xl mb-4">😢</span>
                    <p className="text-xl">Aucun film favori pour le moment.</p>
                    <p className="text-sm mt-2">Retourne à l'accueil pour en ajouter !</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                    {favMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            rating={movie.vote_average}
                            year={movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0}
                            onClick={() => {}}
                            isFavorite={true}
                            onToggleFavorite={(e) => removeFavorite(e, movie.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;