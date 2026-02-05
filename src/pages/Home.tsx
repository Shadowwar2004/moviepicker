import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useMovies } from "../hooks/useMovies";
import { useFavorites } from "../hooks/useFavorites";

const genres = [
    { id: "anime", name: "Anime" },
    { id: 28, name: "Action" },
    { id: 12, name: "Aventure" },
    { id: 35, name: "Comédie" },
    { id: 27, name: "Horreur" },
    { id: 878, name: "Sci-Fi" },
    { id: 10749, name: "Romance" },
    { id: 53, name: "Thriller" },
];

const Home = () => {
    const {
        movies, isLoading,
        searchTerm, setSearchTerm,
        selectedGenre, setSelectedGenre,
        setPage
    } = useMovies();

    const { toggleFavorite, isFavorite } = useFavorites();
    const navigate = useNavigate();
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
    }, [isLoading, setPage]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-grid pb-20" // Ajout de bg-grid ici
        >

            {/* RECHERCHE & FILTRES */}
            <div className="flex flex-col items-center mb-12 space-y-6 pt-12">

                {/* Input : Style Dark Cyberpunk */}
                <div className="relative w-full max-w-xl group px-4">
                    <input
                        type="text"
                        placeholder="RECHERCHER UN FILM..."
                        className="w-full bg-slate-900 text-white font-bold text-lg uppercase px-6 py-4 border-4 border-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:shadow-[0px_0px_20px_rgba(168,85,247,0.5)] transition-all rounded-none"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setSelectedGenre(null); }}
                    />
                    <span className="absolute right-10 top-5 text-white text-xl pointer-events-none">🔍</span>
                </div>

                {/* Boutons Genres : Bordures Blanches */}
                <div className="flex flex-wrap justify-center gap-3 px-4">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => {
                                if (selectedGenre === genre.id) setSelectedGenre(null);
                                else { setSelectedGenre(genre.id); setSearchTerm(""); }
                            }}
                            className={`px-4 py-2 border-2 font-bold uppercase tracking-wide transition-all ${
                                selectedGenre === genre.id
                                    ? "bg-purple-600 border-purple-600 text-white shadow-[0px_0px_15px_rgba(147,51,234,0.6)]"
                                    : "bg-transparent border-white text-white hover:bg-white hover:text-black"
                            }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRILLE DE FILMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center px-4">
                {movies.map((movie, index) => (
                    movie.poster_path && (
                        <MovieCard
                            key={`${movie.id}-${index}`}
                            title={movie.title}
                            posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            rating={movie.vote_average}
                            year={movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            isFavorite={isFavorite(movie.id)}
                            onToggleFavorite={(e) => toggleFavorite(e, movie)}
                        />
                    )
                ))}

                {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>

            {/* SENTINELLE */}
            {movies.length > 0 && !isLoading && (
                <div ref={observerTarget} className="h-10 w-full flex justify-center items-center mt-8">
                    <span className="opacity-0">Chargement...</span>
                </div>
            )}
        </motion.div>
    );
};

export default Home;