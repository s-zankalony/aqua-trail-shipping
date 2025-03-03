'use client';

import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/Toast';
import { getCustomerById, protectRoute, updateCustomer } from '@/utils/actions';
import { useState, useEffect } from 'react';
import { Country } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CustomerCreationSchema,
  type CustomerCreationInput,
} from '@/utils/zodSchemas';
import { Customer } from '@/types';

function CustomerEditPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerCreationInput>({
    resolver: zodResolver(CustomerCreationSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await protectRoute();
        const customerData = await getCustomerById(customerId);

        if (!customerData) {
          router.push('/customer');
          return;
        }

        setCustomer(customerData);
        reset({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          country: customerData.country,
        });
      } catch (error) {
        setToast({
          text:
            error instanceof Error ? error.message : 'Failed to load customer',
          type: 'error',
          status: 'block',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [customerId, router, reset]);

  const onSubmit = async (data: CustomerCreationInput) => {
    try {
      await updateCustomer({
        customerData: {
          ...data,
          id: customerId,
        },
      });
      setToast({
        text: 'Customer updated successfully!',
        type: 'success',
        status: 'block',
      });

      // Optionally redirect after successful update
      router.push(`/customer/${customerId}`);
    } catch (error) {
      setToast({
        text: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
        status: 'block',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">Loading customer data...</div>
    );
  }

  if (!customer) {
    return <div className="p-6">Customer not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Customer</h2>
      {/* Rest of your form code remains unchanged */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
          />
          {errors.name && (
            <span className="text-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
          />
          {errors.email && (
            <span className="text-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Phone"
            className="input input-bordered w-full"
          />
          {errors.phone && (
            <span className="text-error">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            {...register('address')}
            type="text"
            placeholder="Address"
            className="input input-bordered w-full"
          />
          {errors.address && (
            <span className="text-error">{errors.address.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">City</span>
          </label>
          <input
            {...register('city')}
            type="text"
            placeholder="City"
            className="input input-bordered w-full"
          />
          {errors.city && (
            <span className="text-error">{errors.city.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>
          <select
            {...register('country')}
            className="select select-bordered w-full"
          >
            <option value="">Select a country</option>
            {Object.values(Country).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-error">{errors.country.message}</span>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push(`/customer/${customerId}`)}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            Update Customer
          </button>
        </div>
      </form>
      <Toast text={toast.text} type={toast.type} status={toast.status} />
    </div>
  );
}

export default CustomerEditPage;
