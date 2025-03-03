'use client';
import AirFreightBooking from '@/components/AirFreightBooking';
import SeaFreightBooking from '@/components/SeaFreightBooking';
import RoadTransportBooking from '@/components/RoadTransportBooking';
import WarehousingBooking from '@/components/WarehousingBooking';
import { protectRoute } from '@/utils/actions';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function BookingPage() {
  useEffect(() => {
    const checkAuth = async () => {
      await protectRoute();
    };

    checkAuth();
  }, []);

  const params = useParams();
  const service = params.service;
  const renderBookingComponent = () => {
    switch (service) {
      case 'airfreight':
        return <AirFreightBooking />;
      case 'seafreight':
        return <SeaFreightBooking />;
      case 'roadtransport':
        return <RoadTransportBooking />;
      case 'warehousing':
        return <WarehousingBooking />;
      default:
        return <div>Invalid service</div>;
    }
  };
  return <div className="p-8">{renderBookingComponent()}</div>;
}
