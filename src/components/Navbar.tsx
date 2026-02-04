import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="border-b-4 border-black bg-white p-6 flex flex-col md:flex-row justify-between items-center relative z-20">

            {/* Logo : Un gros bloc noir avec texte blanc */}
            <Link to="/" className="text-4xl font-black uppercase tracking-tighter bg-black text-white px-4 py-2 transform -rotate-2 hover:rotate-0 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(255,200,0,1)]">
                Shadow<span className="text-yellow-400">Picker</span>
            </Link>

            {/* Liens : Des boutons rectangles */}
            <div className="flex gap-4 mt-4 md:mt-0 font-bold">
                <Link to="/" className="px-4 py-2 border-2 border-transparent hover:border-black hover:bg-purple-200 transition-all">
                    ACCUEIL
                </Link>
                <Link to="/favorites" className="px-4 py-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center gap-2">
                    FAVORIS ❤️
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;