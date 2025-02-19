import { getBookingById, protectRoute } from '@/utils/actions';
import BookingActions from '@/components/BookingActions';

async function BookingDetailsPage({
  params,
}: {
  params: { bookingId: string };
}) {
  await protectRoute();
  const { bookingId } = params;
  const booking = await getBookingById(bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Booking not found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 border-b pb-2">
            Booking Details #{bookingId}
          </h2>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Shipper Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Name:</span>
                <span>{booking.shipper.name}</span>
                <span className="font-semibold">Email:</span>
                <span>{booking.shipper.email}</span>
                <span className="font-semibold">Phone:</span>
                <span>{booking.shipper.phone}</span>
                <span className="font-semibold">Address:</span>
                <span>{booking.shipper.address}</span>
                <span className="font-semibold">City:</span>
                <span>{booking.shipper.city}</span>
                <span className="font-semibold">Country:</span>
                <span>{booking.shipper.country}</span>
              </div>
            </div>

            {/* Container Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Container Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Type:</span>
                <span>{booking.containerType}</span>
                <span className="font-semibold">Size:</span>
                <span>
                  {booking.containerSize === 'TWENTY_FT' ? '20ft' : '40ft'}
                </span>
                <span className="font-semibold">Quantity:</span>
                <span>{booking.containerQuantity}</span>
                <span className="font-semibold">Commodity:</span>
                <span>{booking.commodity}</span>
                <span className="font-semibold">Weight:</span>
                <span>{booking.weight} KG</span>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {booking.dg && (
              <div className="card bg-warning text-warning-content">
                <div className="card-body">
                  <h3 className="card-title">Dangerous Goods</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-bold">UN Number:</span>{' '}
                      {booking.unNumber}
                    </p>
                    <p>
                      <span className="font-bold">Class:</span> {booking.class}
                    </p>
                    <p>
                      <span className="font-bold">Packing Group:</span>{' '}
                      {booking.packingGroup}
                    </p>
                    <p>
                      <span className="font-bold">Flash Point:</span>{' '}
                      {booking.flashPoint}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Marine Pollutant:</span>
                      <input
                        type="checkbox"
                        checked={booking.marinePollutant ?? false}
                        className="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {booking.reefer && (
              <div className="card bg-info text-info-content">
                <div className="card-body">
                  <h3 className="card-title">Reefer Details</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-bold">Temperature:</span>{' '}
                      {booking.temperature}
                    </p>
                    <p>
                      <span className="font-bold">Ventilation:</span>{' '}
                      {booking.ventilation}
                    </p>
                    <p>
                      <span className="font-bold">Humidity:</span>{' '}
                      {booking.humidity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {booking.oog && (
              <div className="card bg-error text-error-content">
                <div className="card-body">
                  <h3 className="card-title">Out of Gauge</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-bold">Over Length:</span>{' '}
                      {booking.overLength}
                    </p>
                    <p>
                      <span className="font-bold">Over Width:</span>{' '}
                      {booking.overWidth}
                    </p>
                    <p>
                      <span className="font-bold">Over Height:</span>{' '}
                      {booking.overHeight}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Route Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Route Information</h3>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Origin</div>
                <div className="stat-value text-lg">{booking.origin}</div>
                <div className="stat-desc">Port: {booking.pol}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Destination</div>
                <div className="stat-value text-lg">{booking.destination}</div>
                <div className="stat-desc">Port: {booking.pod}</div>
              </div>

              <div className="stat">
                <div className="stat-title">ETD</div>
                <div className="stat-value text-lg">
                  {booking.etd.toLocaleDateString()}
                </div>
                <div className="stat-desc">
                  {booking.etd.toLocaleTimeString()}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Created</div>
                <div className="stat-value text-lg">
                  {booking.createdAt.toLocaleDateString()}
                </div>
                <div className="stat-desc">
                  {booking.createdAt.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <BookingActions />
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsPage;
