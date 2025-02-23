import AirFreightBooking from '@/components/AirFreightBooking';
import SeaFreightBooking from '@/components/SeaFreightBooking';
import RoadTransportBooking from '@/components/RoadTransportBooking';
import WarehousingBooking from '@/components/WarehousingBooking';
import { protectRoute } from '@/utils/actions';

async function BookingPage({ params }: { params: { service: string } }) {
  await protectRoute();

  const { service } = await params;
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
export default BookingPage;
