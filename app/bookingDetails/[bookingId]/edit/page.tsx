'use client';
import { getBookingById, getCustomerById } from '@/utils/actions';
import { BookingData, CustomerData } from '@/types';
import BookingEditForm from '@/components/BookingEditForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingEditPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedBooking = await getBookingById(bookingId);

      // Transform the fetched data to match BookingData type
      if (fetchedBooking) {
        const transformedBooking: BookingData = {
          customerId: fetchedBooking.customerId,
          containerType: fetchedBooking.containerType,
          containerSize: fetchedBooking.containerSize,
          containerQuantity: fetchedBooking.containerQuantity,
          commodity: fetchedBooking.commodity,
          weight: fetchedBooking.weight,
          dg: fetchedBooking.dg,
          reefer: fetchedBooking.reefer,
          oog: fetchedBooking.oog,
          origin: fetchedBooking.origin,
          destination: fetchedBooking.destination,
          pol: fetchedBooking.pol,
          pod: fetchedBooking.pod,
          etd: new Date(fetchedBooking.etd),

          // Convert null values to undefined for optional properties
          unNumber: fetchedBooking.unNumber || undefined,
          class: fetchedBooking.class || undefined,
          packingGroup: fetchedBooking.packingGroup || undefined,
          flashPoint: fetchedBooking.flashPoint || undefined,
          marinePollutant: fetchedBooking.marinePollutant || false,
          temperature: fetchedBooking.temperature || undefined,
          ventilation: fetchedBooking.ventilation || undefined,
          humidity: fetchedBooking.humidity || undefined,
          overLength: fetchedBooking.overLength || undefined,
          overWidth: fetchedBooking.overWidth || undefined,
          overHeight: fetchedBooking.overHeight || undefined,
        };

        setBookingData(transformedBooking);

        if (fetchedBooking.customerId) {
          const fetchedCustomer = await getCustomerById(
            fetchedBooking.customerId
          );
          setCustomer(fetchedCustomer);
        }
      }
    }

    fetchData();
  }, [bookingId]);

  if (!bookingData || !customer) return <div>Loading...</div>;

  return (
    <BookingEditForm
      booking={bookingData}
      customer={customer}
      bookingId={bookingId}
    />
  );
}
