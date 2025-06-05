import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { mockArtisans } from '@/app/artisans/page';
import type { Artisan } from '@/app/artisans/page';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const artisanId = parseInt(params.id);
  const artisan = mockArtisans.find((a: Artisan) => a.id === artisanId);

  if (!artisan) {
    return new NextResponse('Artisan not found', { status: 404 });
  }

  // Check if the authenticated user is the owner of this artisan profile
  if ((session.user as any).artisanId !== artisanId) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  return NextResponse.json(artisan);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const artisanId = parseInt(params.id);
  
  // Check if the authenticated user is the owner of this artisan profile
  if ((session.user as any).artisanId !== artisanId) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  try {
    const updatedArtisan = await request.json();
    
    // In a real application, you would update the database here
    // For now, we'll just return the updated data
    return NextResponse.json(updatedArtisan);
  } catch (error) {
    return new NextResponse('Invalid request data', { status: 400 });
  }
} 