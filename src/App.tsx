import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string; // Image large pour le fond
    vote_average: number;
    release_date: string;
    overview: string;      // Le résumé du film
}

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // NOUVEAU : État pour savoir quel film est cliqué (null = aucun film ouvert)
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const endpoint = searchTerm
            ? `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${API_KEY}&language=fr-FR` // J'ai ajouté language=fr-FR pour avoir les résumés en français !
            : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=fr-FR`;

        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => setMovies(data.results || []));
    }, [searchTerm, API_KEY]);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 relative">

            {/* --- Header (inchangé) --- */}
            <div className="flex flex-col items-center mb-12 space-y-6">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    🎬 Movie Picker
                </h1>
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Rechercher un film..."
                        className="w-full bg-slate-800 text-white px-5 py-3 rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Grille des films --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {movies.map((movie) => (
                    movie.poster_path && (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            rating={movie.vote_average}
                            year={movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0}
                            // Quand on clique, on stocke le film entier dans l'état
                            onClick={() => setSelectedMovie(movie)}
                        />
                    )
                ))}
            </div>

            {/* --- LA MODALE (Affichée seulement si selectedMovie existe) --- */}
            {selectedMovie && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                     onClick={() => setSelectedMovie(null)} // Cliquer à côté ferme la modale
                >
                    <div className="bg-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
                         onClick={(e) => e.stopPropagation()} // Empêche de fermer si on clique DANS la modale
                    >
                        {/* Bouton Fermer */}
                        <button
                            onClick={() => setSelectedMovie(null)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition"
                        >
                            ✕
                        </button>

                        {/* Grande image de fond (Backdrop) */}
                        <div className="h-64 sm:h-80 relative">
                            <img
                                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                                alt={selectedMovie.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent"></div>
                        </div>

                        {/* Contenu textuel */}
                        <div className="p-8">
                            <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
                            <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
                                <span>{selectedMovie.release_date?.substring(0, 4)}</span>
                                <span className="text-yellow-400 font-bold">★ {selectedMovie.vote_average.toFixed(1)}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                                {selectedMovie.overview || "Aucun résumé disponible."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default App