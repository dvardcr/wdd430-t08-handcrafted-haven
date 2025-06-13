import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { mockArtisans, type Artisan } from '@/lib/mockData';
import { authOptions } from '@/lib/authOptions';
import { updateArtisanPassword } from '@/app/lib/data';

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