'use client';

function AddCustomerButton() {
  const handleAddCustomer = () => {
    window.location.href = '/customer/create';
  };

  return (
    <button className="btn btn-primary" onClick={handleAddCustomer}>
      Add New Customer
    </button>
  );
}

export default AddCustomerButton;
