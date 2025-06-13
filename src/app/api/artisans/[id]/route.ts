import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { mockArtisans, type Artisan } from '@/lib/mockData';
import { authOptions } from '@/lib/authOptions';

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
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const artisanId = parseInt(context.params.id);
  
  // Check if the authenticated user is the owner of this artisan profile
  if (session.user.artisanId !== artisanId) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  try {
    const updatedArtisan = await request.json();
    return NextResponse.json(updatedArtisan);
  } catch {
    return new NextResponse('Invalid request data', { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const artisanId = parseInt(context.params.id);
  
  // Check if the authenticated user is the owner of this artisan profile
  if (session.user.artisanId !== artisanId) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  try {
    // In a real application, you would delete the artisan from the database here
    // For now, we'll just return a success response
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Failed to delete artisan', { status: 500 });
  }
} 