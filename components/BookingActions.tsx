'use client';

type BookingActionsProps = {
  bookingId: string;
};

function BookingActions({ bookingId }: BookingActionsProps) {
  return (
    <div className="card-actions justify-end mt-6">
      <button className="btn btn-primary" onClick={() => window.print()}>
        Print Booking
      </button>
      <button className="btn  btn-warning">
        <a href={`/bookingDetails/${bookingId}/edit`}>Edit</a>
      </button>
      <button className="btn" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}

export default BookingActions;
