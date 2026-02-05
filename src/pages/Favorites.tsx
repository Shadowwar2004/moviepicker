import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../hooks/useFavorites";

const Favorites = () => {
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-grid pb-20 pt-8 px-4"
        >
            {/* EN-TÊTE DARK */}
            <div className="flex flex-col items-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    Ma Collection <span className="text-red-500">❤️</span>
                </h2>
                <div className="h-1 w-32 bg-purple-500 shadow-[0_0_10px_purple]"></div>
                <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest">
                    {favorites.length} {favorites.length === 1 ? "Film sauvegardé" : "Films sauvegardés"}
                </p>
            </div>

            {/* LISTE */}
            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
                    <div className="text-8xl animate-pulse">🎬</div>
                    <h3 className="text-2xl font-black uppercase text-white">C'est bien vide ici !</h3>
                    <p className="text-slate-400 font-medium max-w-md">
                        Tu n'as pas encore ajouté de films à ta collection.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest border-2 border-white hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
                    >
                        Explorer les films
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                    <AnimatePresence>
                        {favorites.map((movie) => (
                            <motion.div
                                key={movie.id}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <MovieCard
                                    title={movie.title}
                                    posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    rating={movie.vote_average}
                                    year={movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0}
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    isFavorite={isFavorite(movie.id)}
                                    onToggleFavorite={(e) => toggleFavorite(e, movie)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default Favorites;