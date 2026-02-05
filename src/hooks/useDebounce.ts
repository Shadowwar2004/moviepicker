import { useState, useEffect } from "react";

// Ce hook retarde la mise à jour d'une valeur (ex: searchTerm)
// delay : temps en ms (ex: 500ms)
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // On lance un timer à chaque changement de valeur
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Si la valeur change encore avant la fin, on annule le timer précédent
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}