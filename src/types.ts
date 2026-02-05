export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    overview: string;
    runtime?: number;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}


export interface Actor {
    id: number;
    name: string;
    biography: string;
    birthday: string;
    place_of_birth: string;
    profile_path: string | null;
}