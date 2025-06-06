import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/data';

function validateReview(data: any) {
    if (
        !data ||
        typeof data.product_id !== 'string' ||
        !/^[0-9a-fA-F-]{36}$/.test(data.product_id) ||
        typeof data.username !== 'string' ||
        data.username.trim().length === 0 ||
        typeof data.comment !== 'string' ||
        data.comment.trim().length === 0 ||
        typeof data.rating !== 'number' ||
        !Number.isInteger(data.rating) ||
        data.rating < 1 ||
        data.rating > 5
    ) {
        return false;
    }
    return true;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!validateReview(body)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const [newReview] = await sql`
        INSERT INTO reviews (product_id, username, comment, rating)
        VALUES (${body.product_id}, ${body.username.trim()}, ${body.comment.trim()}, ${body.rating})
        RETURNING id, username, comment, rating, created_at
        `;

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('POST /api/reviews error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
