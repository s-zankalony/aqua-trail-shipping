'use client';
function CustomerPrintAction({
  userId,
  customerId,
}: {
  userId: string;
  customerId: string;
}) {
  return (
    <div className="card-actions justify-end mt-6">
      <button className="btn btn-outline">
        <a href={`/profile/${userId}/customers`}>Back</a>
      </button>
      <button className="btn btn-warning">
        <a href={`/customer/${customerId}/edit`}>Edit</a>
      </button>
      <button className="btn btn-primary" onClick={() => window.print()}>
        Print Details
      </button>
    </div>
  );
}

export default CustomerPrintAction;
