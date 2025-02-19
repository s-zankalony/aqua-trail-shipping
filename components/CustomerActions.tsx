'use client';

type CustomerActionsProps = {
  customerId: string;
};

function CustomerActions({ customerId }: CustomerActionsProps) {
  const handleView = () => {
    // View customer details
    window.location.href = `/customer/${customerId}`;
  };

  const handleEdit = () => {
    // Edit customer
    window.location.href = `/customer/${customerId}/edit`;
  };

  return (
    <div className="flex space-x-2">
      <button className="btn btn-sm btn-info" onClick={handleView}>
        View
      </button>
      <button className="btn btn-sm btn-warning" onClick={handleEdit}>
        Edit
      </button>
    </div>
  );
}

export default CustomerActions;
