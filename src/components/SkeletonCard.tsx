const SkeletonCard = () => {
    return (
        <div className="w-48 bg-slate-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
            {/* Fausse image (bloc gris) */}
            <div className="w-full h-72 bg-slate-700" />

            {/* Faux contenu */}
            <div className="p-3 space-y-3">
                {/* Faux titre */}
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                {/* Fausse année */}
                <div className="h-3 bg-slate-700 rounded w-1/4"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;