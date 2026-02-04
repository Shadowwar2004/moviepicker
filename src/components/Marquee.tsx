const Marquee = () => {
    return (
        <div className="w-full bg-yellow-400 border-y-4 border-black overflow-hidden py-2 font-bold text-lg uppercase tracking-widest relative z-10">
            <div className="whitespace-nowrap animate-marquee inline-block">
                <span className="mx-4">🔥 TENDANCES DU MOMENT</span>
                <span className="mx-4">•</span>
                <span className="mx-4">FILMS POPULAIRES</span>
                <span className="mx-4">•</span>
                <span className="mx-4">NOUVEAUTÉS NETFLIX</span>
                <span className="mx-4">•</span>
                <span className="mx-4">CHOISIS TON FILM</span>
                <span className="mx-4">•</span>
                <span className="mx-4">🍿 PRÉPARE LE POPCORN</span>
                <span className="mx-4">•</span>
                {/* On répète pour que ça boucle sans trou visuel immédiat */}
                <span className="mx-4">🔥 TENDANCES DU MOMENT</span>
                <span className="mx-4">•</span>
                <span className="mx-4">FILMS POPULAIRES</span>
                <span className="mx-4">•</span>
            </div>
        </div>
    );
};

export default Marquee;