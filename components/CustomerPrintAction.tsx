'use client';
function CustomerPrintAction() {
  return (
    <div className="card-actions justify-end mt-6">
      <button className="btn btn-outline" onClick={() => window.history.back()}>
        Back
      </button>
      <button className="btn btn-primary" onClick={() => window.print()}>
        Print Details
      </button>
    </div>
  );
}
export default CustomerPrintAction;
