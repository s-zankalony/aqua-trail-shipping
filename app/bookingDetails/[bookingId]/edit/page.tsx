import {
  findCustomers,
  createSeafreightBooking,
  protectRoute,
  getBookingById,
  getCustomerById,
} from '@/utils/actions';
import { BookingData } from '@/utils/types';
import { redirect } from 'next/navigation';
import Toast from '@/components/Toast';
import { Country } from '@prisma/client';
import { getUserId } from '@/utils/actions';
import BookingEditForm from '@/components/BookingEditForm';

export default async function BookingEditPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const bookingId = params.bookingId;
  const bookingData = await getBookingById(bookingId);
  const customer = bookingData?.customerId
    ? await getCustomerById(bookingData.customerId)
    : null;

  if (!bookingData || !customer) return <div>Loading...</div>;

  // Convert null values to undefined to match BookingData type
  const booking: BookingData = {
    ...bookingData,
    unNumber: bookingData.unNumber || undefined,
    class: bookingData.class || undefined,
    packingGroup: bookingData.packingGroup || undefined,
    flashPoint: bookingData.flashPoint || undefined,
    temperature: bookingData.temperature || undefined,
    ventilation: bookingData.ventilation || undefined,
    humidity: bookingData.humidity || undefined,
    overLength: bookingData.overLength || undefined,
    overWidth: bookingData.overWidth || undefined,
    overHeight: bookingData.overHeight || undefined,
    marinePollutant: bookingData.marinePollutant || false,
  };

  return (
    <BookingEditForm
      booking={booking}
      customer={customer}
      bookingId={bookingId}
    />
  );
}
