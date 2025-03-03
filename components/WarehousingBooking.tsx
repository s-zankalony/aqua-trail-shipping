function WarehousingBooking() {
  return (
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <h1 className="card-title text-3xl mb-6 justify-center">
          Warehousing Booking
        </h1>
        <div className="prose">
          <p className="text-lg">
            This is a demo feature showcasing our booking interface. For a
            working example of our booking system, please visit our{' '}
            <a href="/booking/seafreight" className="link link-primary">
              Sea Freight Booking
            </a>{' '}
            page.
          </p>
          <p className="text-sm text-neutral-500 mt-4">
            Note: Warehousing booking implementation will be customized based on
            specific business requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
export default WarehousingBooking;
