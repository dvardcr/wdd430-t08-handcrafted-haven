export type Comment = {
    id: number;
    username: string;
    text: string;
    rating: number;
};

export type Product = {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    artist: string;
    type: string;
};
