'use client';

function BookingActions() {
  return (
    <div className="card-actions justify-end mt-6">
      <button className="btn btn-primary" onClick={() => window.print()}>
        Print Booking
      </button>
      <button className="btn" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}

export default BookingActions;
