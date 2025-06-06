export interface Comment {
	id: string;
	username: string;
	comment: string;
	rating: number;
	created_at: Date;
}
export type Product = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    artist: string;
};