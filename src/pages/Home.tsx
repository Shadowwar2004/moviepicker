import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";

// --- INTERFACES ---
export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    overview: string;
}

interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

// Liste des filtres : On mélange des IDs (nombres) et des Custom (strings)
const genres = [
    { id: "anime", name: "🇯🇵 Anime" },
    { id: "game", name: "🎮 Jeux Vidéo" },
    { id: 28, name: "Action" },
    { id: 12, name: "Aventure" },
    { id: 35, name: "Comédie" },
    { id: 27, name: "Horreur" },
    { id: 878, name: "Sci-Fi" },
    { id: 10749, name: "Romance" },
    { id: 53, name: "Thriller" },
];

const Home = () => {
    // --- ÉTATS ---
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [page, setPage] = useState(1);

    // IMPORTANT : Le genre peut être un nombre (28) OU une chaîne ("game")
    const [selectedGenre, setSelectedGenre] = useState<number | string | null>(null);

    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [favorites, setFavorites] = useState<Movie[]>(() => {
        const saved = localStorage.getItem("movieFavorites");
        return saved ? JSON.parse(saved) : [];
    });

    const API_KEY = import.meta.env.VITE_API_KEY;

    // --- LOGIQUE API (C'est ici que la magie opère) ---
    const fetchMovies = async (isLoadMore = false) => {
        if (!isLoadMore) setIsLoading(true);

        let url = "";
        const baseParams = `api_key=${API_KEY}&page=${page}&language=fr-FR&sort_by=popularity.desc`;

        // 1. RECHERCHE
        if (searchTerm) {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}&language=fr-FR`;
        }
        // 2. ANIME (Genre Animation + Langue Japonaise)
        else if (selectedGenre === "anime") {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}&with_genres=16&with_original_language=ja`;
        }
        // 3. JEUX VIDÉO (Mot-clé spécifique "Based on video game")
        else if (selectedGenre === "game") {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}&with_keywords=33752`;
        }
        // 4. GENRES CLASSIQUES (Seulement si c'est un nombre !)
        else if (typeof selectedGenre === 'number') {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}&with_genres=${selectedGenre}`;
        }
        // 5. PAR DÉFAUT (Populaires)
        else {
            url = `https://api.themoviedb.org/3/discover/movie?${baseParams}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (isLoadMore) {
                setMovies((prev) => [...prev, ...data.results]);
            } else {
                setMovies(data.results || []);
            }
        } catch (error) {
            console.error("Erreur fetch movies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTrailer = async (movieId: number) => {
        try {
            const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
            const res = await fetch(url);
            const data = await res.json();
            const trailer = data.results.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube");
            setTrailerKey(trailer ? trailer.key : null);
        } catch (e) { console.error(e); }
    };

    const fetchCast = async (movieId: number) => {
        try {
            const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`;
            const res = await fetch(url);
            const data = await res.json();
            setCast(data.cast.slice(0, 10));
        } catch (e) { console.error(e); }
    };

    // --- EFFETS ---
    useEffect(() => {
        if (page > 1) fetchMovies(true);
    }, [page]);

    useEffect(() => {
        setPage(1);
        fetchMovies(false);
    }, [searchTerm, selectedGenre]);

    useEffect(() => {
        if (selectedMovie) {
            fetchTrailer(selectedMovie.id);
            fetchCast(selectedMovie.id);
        } else {
            setTrailerKey(null);
            setCast([]);
        }
    }, [selectedMovie]);

    useEffect(() => {
        localStorage.setItem("movieFavorites", JSON.stringify(favorites));
    }, [favorites]);

    // --- HANDLERS ---
    const toggleFavorite = (e: React.MouseEvent, movie: Movie) => {
        e.stopPropagation();
        const isAlreadyFav = favorites.some(fav => fav.id === movie.id);

        if (isAlreadyFav) {
            setFavorites(favorites.filter(fav => fav.id !== movie.id));
        } else {
            setFavorites([...favorites, movie]);
        }
    };

    const isFavorite = (movieId: number) => favorites.some(fav => fav.id === movieId);

    return (
        <div className="pb-20">

            {/* --- SECTION RECHERCHE & FILTRES (Style Néo-Brutalisme) --- */}
            <div className="flex flex-col items-center mb-12 space-y-6 pt-8">

                {/* Input Recherche */}
                <div className="relative w-full max-w-xl group">
                    <input
                        type="text"
                        placeholder="RECHERCHER UN FILM..."
                        className="w-full bg-white text-black font-bold text-lg uppercase px-6 py-4 border-4 border-black placeholder:text-slate-500 focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setSelectedGenre(null); }}
                    />
                    <span className="absolute right-6 top-5 text-black text-xl pointer-events-none">🔍</span>
                </div>

                {/* Boutons Genres */}
                <div className="flex flex-wrap justify-center gap-3 px-4">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => {
                                if (selectedGenre === genre.id) setSelectedGenre(null);
                                else { setSelectedGenre(genre.id); setSearchTerm(""); }
                            }}
                            className={`px-4 py-2 border-2 border-black font-bold uppercase tracking-wide transition-all ${
                                selectedGenre === genre.id
                                    ? "bg-purple-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1"
                                    : "bg-white text-black hover:bg-purple-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
                            }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRILLE DE FILMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

                {!isLoading && movies.map((movie, index) => (
                    movie.poster_path && (
                        <MovieCard
                            key={`${movie.id}-${index}`}
                            title={movie.title}
                            posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            rating={movie.vote_average}
                            year={movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0}
                            onClick={() => setSelectedMovie(movie)}
                            isFavorite={isFavorite(movie.id)}
                            onToggleFavorite={(e) => toggleFavorite(e, movie)}
                        />
                    )
                ))}
            </div>

            {/* BOUTON CHARGER PLUS */}
            {!isLoading && movies.length > 0 && (
                <div className="flex justify-center mt-16">
                    <button
                        onClick={() => setPage(page + 1)}
                        className="px-8 py-4 bg-green-400 border-4 border-black text-black font-black text-lg uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:bg-green-500 transition-all"
                    >
                        Charger plus de films ↓
                    </button>
                </div>
            )}

            {/* MODALE POP-ART */}
            {selectedMovie && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
                     onClick={() => setSelectedMovie(null)}
                >
                    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-5xl w-full overflow-hidden relative max-h-[90vh] overflow-y-auto"
                         onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMovie(null)}
                            className="absolute top-4 right-4 bg-red-500 border-2 border-black text-white font-bold w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-transform z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            ✕
                        </button>

                        <div className="w-full aspect-video bg-black relative border-b-4 border-black">
                            {trailerKey ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                                    alt={selectedMovie.title}
                                    className="w-full h-full object-cover opacity-90"
                                />
                            )}
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-4xl font-black uppercase text-black leading-none">{selectedMovie.title}</h2>
                                <button
                                    onClick={(e) => toggleFavorite(e, selectedMovie)}
                                    className="text-4xl hover:scale-125 transition-transform text-red-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                >
                                    {isFavorite(selectedMovie.id) ? "♥" : "♡"}
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 mb-8">
                                <span className="bg-black text-white font-bold px-3 py-1 text-sm border-2 border-transparent">{selectedMovie.release_date?.substring(0, 4)}</span>
                                <span className="bg-yellow-400 text-black border-2 border-black font-bold px-3 py-1 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        ★ {selectedMovie.vote_average.toFixed(1)}
                    </span>
                            </div>

                            <p className="text-black font-medium text-lg leading-relaxed mb-8 border-l-4 border-purple-500 pl-4">
                                {selectedMovie.overview || "Aucun résumé disponible pour ce contenu."}
                            </p>

                            {cast.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-black uppercase text-black mb-4 border-b-4 border-black inline-block pb-1">Têtes d'affiche</h3>
                                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
                                        {cast.map((actor) => (
                                            actor.profile_path && (
                                                <div key={actor.id} className="flex-shrink-0 w-24 text-center group cursor-pointer">
                                                    <div className="relative mb-2">
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                            alt={actor.name}
                                                            className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-black group-hover:scale-110 transition-transform bg-gray-200"
                                                        />
                                                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-yellow-400 border-2 border-black rounded-full z-10"></div>
                                                    </div>
                                                    <p className="text-sm font-bold text-black uppercase truncate">{actor.name}</p>
                                                    <p className="text-xs font-bold text-purple-600 truncate">{actor.character}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;