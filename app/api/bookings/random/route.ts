import { NextResponse } from 'next/server';
import { getRandomBookingId } from '@/utils/actions';

export async function GET() {
  try {
    const bookingId = await getRandomBookingId();
    if (!bookingId) {
      return NextResponse.json(
        { message: 'No bookings available' },
        { status: 404 }
      );
    }

    return NextResponse.json({ bookingId });
  } catch (error) {
    console.error('Error fetching random booking id via API route:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve booking' },
      { status: 500 }
    );
  }
}
