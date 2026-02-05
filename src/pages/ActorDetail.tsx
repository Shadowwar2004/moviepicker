import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type {Actor, Movie} from "../types";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../hooks/useFavorites";

const ActorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [actor, setActor] = useState<Actor | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            window.scrollTo(0, 0);
            try {
                const actorRes = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=fr-FR`);
                const actorData = await actorRes.json();
                setActor(actorData);

                const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=fr-FR`);
                const creditsData = await creditsRes.json();

                const sortedMovies = creditsData.cast?.sort((a: any, b: any) => b.popularity - a.popularity) || [];
                setMovies(sortedMovies);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, API_KEY]);

    if (isLoading) return <div className="text-center text-white mt-20 text-2xl font-bold">Chargement...</div>;
    if (!actor) return <div className="text-center text-white mt-20">Acteur introuvable</div>;

    // Animation des boîtes Bento
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        // Ajout de 'pt-8' pour l'espacement en haut
        <div className="bg-slate-950 min-h-screen text-white pb-20 pt-8 px-4 bg-grid">

            {/* CONTENEUR PRINCIPAL CENTRÉ */}
            <div className="max-w-7xl mx-auto">

                {/* --- CORRECTION DU BOUTON RETOUR --- */}
                {/* Il n'est plus 'fixed' ni 'absolute'. Il est juste là, au début du flux. */}
                <div className="mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                        <span>←</span> Retour
                    </motion.button>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-center mb-12 uppercase tracking-tighter drop-shadow-2xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {actor.name}
                    </span>
                </h1>

                {/* --- LE BENTO GRID --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
                >

                    {/* PHOTO */}
                    <motion.div variants={itemVariants} className="md:row-span-2 relative group overflow-hidden rounded-3xl border-2 border-white/10 bg-slate-900 shadow-2xl">
                        <img
                            src={`https://image.tmdb.org/t/p/original${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    </motion.div>

                    {/* BIO */}
                    <motion.div variants={itemVariants} className="md:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-2xl font-bold text-purple-400 mb-4 uppercase flex items-center gap-2">
                            <span>📝</span> Biographie
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                            {actor.biography || "Aucune biographie disponible pour cet acteur."}
                        </p>
                    </motion.div>

                    {/* NAISSANCE */}
                    <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/10 flex flex-col justify-center items-center text-center hover:bg-slate-800 transition-colors">
                        <span className="text-4xl mb-2">🎂</span>
                        <h3 className="text-slate-400 font-bold uppercase text-sm mb-1">Né(e) le</h3>
                        <p className="text-xl font-black">{actor.birthday || "N/A"}</p>
                    </motion.div>

                    {/* LIEU */}
                    <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/10 flex flex-col justify-center items-center text-center hover:bg-slate-800 transition-colors">
                        <span className="text-4xl mb-2">📍</span>
                        <h3 className="text-slate-400 font-bold uppercase text-sm mb-1">Origine</h3>
                        <p className="text-xl font-black">{actor.place_of_birth || "N/A"}</p>
                    </motion.div>

                </motion.div>

                {/* --- FILMOGRAPHIE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-4xl font-black uppercase text-white">Filmographie</h2>
                        <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                            {movies.length} films
                        </span>
                        <div className="h-px flex-grow bg-white/20"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {movies.map(movie => (
                            movie.poster_path && (
                                <MovieCard
                                    key={movie.id}
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
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ActorDetail;