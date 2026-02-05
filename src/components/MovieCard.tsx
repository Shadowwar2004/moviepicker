import { motion } from "framer-motion"; // On importe motion

interface MovieProps {
    title: string;
    posterUrl: string;
    rating: number;
    year: number;
    onClick: () => void;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
}

const MovieCard = ({ title, posterUrl, rating, year, onClick, isFavorite, onToggleFavorite }: MovieProps) => {
    return (
        <motion.div
            layout // Permet une animation fluide si la grille change
            initial={{ opacity: 0, y: 20 }} // Départ : invisible et un peu plus bas
            animate={{ opacity: 1, y: 0 }}  // Arrivée : visible et à sa place
            transition={{ duration: 0.4 }}  // Durée de l'animation
            whileHover={{ scale: 1.05, y: -5 }} // Effet au survol (plus fluide que CSS)

            onClick={onClick}
            className="w-48 bg-slate-800 rounded-xl overflow-hidden shadow-lg cursor-pointer group relative"
        >
            <div className="relative">
                <img
                    src={posterUrl}
                    alt={title}
                    className="w-full h-72 object-cover"
                />

                <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    ★ {typeof rating === 'number' ? rating.toFixed(1) : "0.0"}
                </div>

                <motion.button
                    whileTap={{ scale: 0.8 }} // Petit effet de rebond au clic
                    onClick={onToggleFavorite}
                    className="absolute top-2 left-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                >
                    {isFavorite ? "❤️" : "🤍"}
                </motion.button>
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-white">{title}</h3>
                <p className="text-xs text-slate-400 mt-1">{year}</p>
            </div>
        </motion.div>
    );
};

export default MovieCard;