import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { mockArtisans, type Artisan } from '@/lib/mockData';
import { authOptions } from '@/lib/authOptions';
import { countArtisans, createProduct, getArtisanByEmail, updateArtisanPassword } from '@/app/lib/data';
import { Product } from '@/app/lib/definitions';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const artisanId = parseInt(context.params.id);
  const artisan = mockArtisans.find((a: Artisan) => a.id === artisanId);

  if (!artisan) {
    return new NextResponse('Artisan not found', { status: 404 });
  }

  // Check if the authenticated user is the owner of this artisan profile
  if (session.user.artisanId !== artisanId) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  return NextResponse.json(artisan);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const artisanId = parseInt(context.params.id);

  if (session.user.artisanId !== artisanId) {
    return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }

  try {
    const body = await request.json();

    // Check for the action flag
    if (body.action === 'update_password') {

      const { newPassword } = body;
      if (!newPassword) {
        return new NextResponse(JSON.stringify({ message: 'Password must be not be empty' }), { status: 400 });
      }

      const success = await updateArtisanPassword(body.email, newPassword);

      if (success) {
        return NextResponse.json({ message: 'Password updated successfully' });
      } else {
        return new NextResponse(JSON.stringify({ message: 'Artisan not found' }), { status: 404 });
      }

    } else {
      const updatedArtisanData = body;
      console.log("Updating artisan profile data:", updatedArtisanData);
      return NextResponse.json(updatedArtisanData);
    }

  } catch (error) {
    console.error("API PUT Error:", error);
    return new NextResponse(JSON.stringify({ message: 'Invalid request data' }), { status: 400 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const product = await request.json();
  const { name,
    description,
    imageUrl,
    price,
    category,
    artisanId, action } = product;


  const newProduct = {
    name,
    description,
    imageUrl,
    price,
    category,
    artisanId
  };

  let newInsertedProduct;
  console.log('New product to be created:', newProduct); // debugging

  if (action === 'add-product') {
    newInsertedProduct = await createProduct(newProduct);
  }

  return NextResponse.json({ message: 'Artisan profile created successfully' }, { status: 201 });
}