import AirFreightBooking from '@/components/AirFreightBooking';
import SeaFreightBooking from '@/components/SeaFreightBooking';
import RoadTransportBooking from '@/components/RoadTransportBooking';
import WarehousingBooking from '@/components/WarehousingBooking';

function BookingPage({ params }: { params: { service: string } }) {
  const renderBookingComponent = () => {
    switch (params.service) {
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
