import { countArtisans, createArtisan, getArtisanByEmail } from "@/app/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const { name, email, password, specialty, bio, imageUrl, location } = body;

    const requiredFields = [name, email, password, specialty, bio, location];
    if (requiredFields.some(field => !field)) {
        return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    // Check wether the email already exists
    const exists = getArtisanByEmail(email) === email;
    if (exists) {
        return new NextResponse(JSON.stringify({ message: 'Email is already in use' }), { status: 409 });
    }

    const newArtisan = await createArtisan({
        name,
        email,
        password,
        specialty,
        bio,
        imageUrl: imageUrl || '/images/artisans/art5.jpeg', // Use provided or default image
        location,
    });

    console.log('New artisan created:', newArtisan); // debugging

    return NextResponse.json({ message: 'Artisan profile created successfully' }, { status: 201 });
}