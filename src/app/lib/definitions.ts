export interface Comment {
    id: string;
    username: string;
    comment: string;
    rating: number;
    created_at: Date;
}
export type Product = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    artisanId: string;
};

export type ProductSecond = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    artist: string;
};

export interface Artisan {
    id: string,
    name: string,
    email: string,
    password: string,
    specialty: string,
    bio: string,
    imageUrl: string,
    location: string,
    artisanId: number
}