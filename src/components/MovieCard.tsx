interface MovieProps {
    title: string;
    posterUrl: string;
    rating: number;
    year: number;
    onClick: () => void;
}

const MovieCard = ({ title, posterUrl, rating, year, onClick }: MovieProps) => {
    return (
        <div
            onClick={onClick} className="w-48 bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative"
        >

            {/* Image du film */}
            <div className="relative">
                <img
                    src={posterUrl}
                    alt={title}
                    className="w-full h-72 object-cover"
                />

                {/* Badge de la note */}
                <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    ★ {rating.toFixed(1)}
                </div>
            </div>

            {/* Informations sous l'image */}
            <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-white">{title}</h3>
                <p className="text-xs text-slate-400 mt-1">{year}</p>
            </div>

        </div>
    );
};

export default MovieCard;