'use client';
import Toast from '@/components/Toast';
import { createCustomer } from '@/utils/actions';
import { useState } from 'react';
import { Country } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CustomerCreationSchema,
  type CustomerCreationInput,
} from '@/utils/zodSchemas';

function CreateCustomerPage() {
  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerCreationInput>({
    resolver: zodResolver(CustomerCreationSchema),
  });

  const onSubmit = async (data: CustomerCreationInput) => {
    try {
      await createCustomer({ customerData: data });
      setToast({
        text: 'Customer created successfully!',
        type: 'alert-success',
        status: 'block',
      });
    } catch (error) {
      setToast({
        text: error instanceof Error ? error.message : 'An error occurred',
        type: 'alert-error',
        status: 'block',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Customer</h2>
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

        <button type="submit" className="btn btn-primary w-full mt-6">
          Create Customer
        </button>
      </form>
      <Toast text={toast.text} type={toast.type} status={toast.status} />;
    </div>
  );
}

export default CreateCustomerPage;
