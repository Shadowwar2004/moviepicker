import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animation
import type { Movie, Cast } from "../types";

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            window.scrollTo(0, 0); // Remonte en haut à chaque changement de film

            try {
                // 1. Infos
                const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=fr-FR`);
                const movieData = await movieRes.json();
                setMovie(movieData);

                // 2. Cast
                const castRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=fr-FR`);
                const castData = await castRes.json();
                setCast(castData.cast?.slice(0, 10) || []);

                // 3. Trailer
                const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
                const videoData = await videoRes.json();
                const trailer = videoData.results?.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube");
                setTrailerKey(trailer ? trailer.key : null);

                // 4. Similaires
                const similarRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=fr-FR&page=1`);
                const similarData = await similarRes.json();
                setSimilarMovies(similarData.results || []);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, API_KEY]);

    const formatRuntime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}min`;
    };

    if (isLoading) return <div className="text-center text-white mt-20 text-2xl font-bold">Chargement...</div>;
    if (!movie) return <div className="text-center text-white mt-20">Film introuvable</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900 min-h-screen text-white pb-20"
        >

            {/* HEADER */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur transition"
                >
                    ← Retour
                </button>

                <div className="absolute bottom-10 left-4 md:left-12 z-20 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-black uppercase drop-shadow-lg mb-4">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-sm md:text-base font-bold">
                        <span className="text-yellow-400 border border-yellow-400 px-2 py-1 rounded">★ {movie.vote_average.toFixed(1)}</span>
                        <span>{movie.release_date.substring(0, 4)}</span>
                        {movie.runtime && (
                            <span className="text-slate-300 border border-slate-500 px-2 py-1 rounded flex items-center gap-1">
                          ⏱ {formatRuntime(movie.runtime)}
                      </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* GAUCHE */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-2xl font-bold text-purple-400 mb-4 uppercase">Synopsis</h2>
                        <p className="text-lg leading-relaxed text-slate-300">{movie.overview}</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-purple-400 mb-6 uppercase">Casting Principal</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                            {cast.map(actor => (
                                <div
                                    key={actor.id}
                                    className="min-w-[100px] text-center cursor-pointer group"
                                    onClick={() => navigate(`/person/${actor.id}`)} // Navigation vers Acteur
                                >
                                    {actor.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                            className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors"
                                            alt={actor.name}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-700 mx-auto mb-2 flex items-center justify-center text-xs">No img</div>
                                    )}
                                    <p className="font-bold text-sm truncate text-white group-hover:text-purple-400 transition-colors">{actor.name}</p>
                                    <p className="text-xs text-slate-400 truncate">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SIMILAIRES */}
                    {similarMovies.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-purple-400 mb-6 uppercase">Vous aimerez aussi</h2>
                            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
                                {similarMovies.map(sim => (
                                    sim.poster_path && (
                                        <div
                                            key={sim.id}
                                            className="min-w-[150px] cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() => navigate(`/movie/${sim.id}`)}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${sim.poster_path}`}
                                                alt={sim.title}
                                                className="rounded-lg shadow-lg mb-2"
                                            />
                                            <p className="font-bold text-sm text-white truncate">{sim.title}</p>
                                            <p className="text-xs text-yellow-400">★ {sim.vote_average.toFixed(1)}</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* DROITE (Trailer) */}
                <div>
                    {trailerKey && (
                        <div className="bg-slate-800 p-1 rounded-xl shadow-2xl border border-slate-700 sticky top-8">
                            <h3 className="text-xl font-bold text-center mb-2 p-2 text-white">Bande-annonce</h3>
                            <iframe
                                className="w-full aspect-video rounded-lg"
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title="Trailer"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MovieDetail;