'use client';
import Toast from '@/components/Toast';
import { createCustomer } from '@/utils/actions';
import { useState } from 'react';

function CreateCustomerPage() {
  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer({ customerData: formData });
      console.log('Customer created successfully!');
      setToast({
        text: 'Customer created successfully!',
        type: 'alert-success',
        status: 'block',
      });
    } catch (error) {
      console.log(error);
      setToast({
        text: error as string,
        type: 'alert-error',
        status: 'block',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="tel"
            placeholder="Phone"
            className="input input-bordered w-full"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            type="text"
            placeholder="Address"
            className="input input-bordered w-full"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">City</span>
          </label>
          <input
            type="text"
            placeholder="City"
            className="input input-bordered w-full"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>
          <input
            type="text"
            placeholder="Country"
            className="input input-bordered w-full"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-6">
          Create Customer
        </button>
      </form>
      <Toast text={toast.text} type={toast.type} status={toast.status} />;
    </div>
  );
}

export default CreateCustomerPage;
