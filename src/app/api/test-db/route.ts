import { sql } from '@/app/lib/data';

export async function GET() {
    try {
        const products = await sql`SELECT COUNT(*) FROM products`;
        return new Response(JSON.stringify({ count: products[0].count }), { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
        errorMessage = error.message;
        }
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}