'use client';
import CustomerPrintAction from '@/components/CustomerPrintAction';
import { getCustomerById, protectRoute } from '@/utils/actions';
import { useEffect, useState } from 'react';
import type { Customer } from '@/types';
import { useParams } from 'next/navigation';

function CustomerDetailsPage() {
  useEffect(() => {
    const checkAuth = async () => {
      await protectRoute();
    };

    checkAuth();
  }, []);

  const params = useParams();
  const { customerId } = params;
  const customerId_str =
    typeof customerId === 'string'
      ? customerId
      : Array.isArray(customerId)
      ? customerId[0]
      : '';
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (customerId_str) {
        const data = await getCustomerById(customerId_str);
        setCustomer(data);
      }
    };

    fetchCustomer();
  }, [customerId_str]);

  if (!customer) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Customer Not Found</h1>
            <p className="py-6">
              The requested customer details could not be found.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6">Customer Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Name</span>
              </label>
              <div className="text-lg">{customer.name}</div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Email</span>
              </label>
              <div className="text-lg">{customer.email}</div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Phone</span>
              </label>
              <div className="text-lg">{customer.phone}</div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Address</span>
              </label>
              <div className="text-lg">{customer.address}</div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">City</span>
              </label>
              <div className="text-lg">{customer.city}</div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Country</span>
              </label>
              <div className="text-lg">
                <div className="badge badge-primary">{customer.country}</div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Created At</span>
              </label>
              <div className="text-lg">
                {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Last Updated</span>
              </label>
              <div className="text-lg">
                {new Date(customer.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <CustomerPrintAction
            userId={customer.userId || ''}
            customerId={customer.id}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsPage;
