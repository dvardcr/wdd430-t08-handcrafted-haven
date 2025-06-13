export interface Comment {
	id: string;
    user_id: string;
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
    artist: string;
};