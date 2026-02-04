interface MovieProps {
    title: string;
    posterUrl: string;
    rating: number;
    year: number;
    onClick: () => void;
    // NOUVEAU : Props pour les favoris
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
}

const MovieCard = ({ title, posterUrl, rating, year, onClick, isFavorite, onToggleFavorite }: MovieProps) => {
    return (
        <div
            onClick={onClick}
            className="w-48 bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative"
        >
            <div className="relative">
                <img
                    src={posterUrl}
                    alt={title}
                    className="w-full h-72 object-cover"
                />

                <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    ★ {rating.toFixed(1)}
                </div>

                {/* NOUVEAU : Le bouton Cœur en haut à gauche */}
                <button
                    onClick={onToggleFavorite}
                    className="absolute top-2 left-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-white">{title}</h3>
                <p className="text-xs text-slate-400 mt-1">{year}</p>
            </div>
        </div>
    );
};

export default MovieCard;