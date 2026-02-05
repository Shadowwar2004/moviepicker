import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";

const Navbar = () => {
    const { favorites } = useFavorites();

    return (
        <nav className="w-full bg-[#020617] border-b border-white/10 py-6 px-4 md:px-12 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            {/* LOGO */}
            <Link to="/" className="group relative">
                <div className="absolute inset-0 bg-yellow-400 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <div className="relative bg-black border-2 border-yellow-400 px-2 py-1">
                    <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase">
                        Shadow<span className="text-yellow-400">Picker</span>
                    </h1>
                </div>
            </Link>

            {/* FAVORIS BUTTON */}
            <Link to="/favorites" className="relative group">
                <div className="absolute inset-0 bg-red-500 rounded-lg translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <button className="relative bg-black border-2 border-red-500 text-white font-bold px-6 py-2 rounded-lg uppercase tracking-wider flex items-center gap-2">
                    Favoris <span className="text-red-500">♥</span>
                    <span className="bg-red-500 text-black text-xs px-2 py-0.5 rounded-full">
                        {favorites.length}
                    </span>
                </button>
            </Link>
        </nav>
    );
};

export default Navbar;