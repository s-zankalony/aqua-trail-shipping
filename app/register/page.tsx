'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ImageSchema,
  UserRegistrationSchema,
  type UserRegistrationInput,
} from '@/utils/zodSchemas';
import { Country } from '@prisma/client';
import { createUser } from '@/utils/actions';
import Toast from '@/components/Toast';
import { redirect } from 'next/navigation';
import { useAuth } from '@/components/useAuth';
import { z } from 'zod';

function UserRegisterPage() {
  // 1. Auth hook
  const { user, loading } = useAuth();
  // 2. State hooks
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>('');

  // 3. Form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationInput>({
    resolver: zodResolver(UserRegistrationSchema),
  });

  // 4. Effects
  useEffect(() => {
    if (user) {
      setToast({
        text: 'Already registered.. register a new user?',
        type: 'warning',
        status: 'block',
      });
    }
  }, [user]);

  if (loading) {
    return <h1 className="text-5xl">Loading...</h1>;
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        ImageSchema.shape.file.parse(file);
        setSelectedImage(file);
        setImageError('');
      } catch (error) {
        if (error instanceof z.ZodError) {
          setImageError(error.errors[0].message);
        }
      }
    }
  };

  const onSubmit = async (data: UserRegistrationInput) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add all text fields
      Object.keys(data).forEach((key) => {
        if (key !== 'image') {
          const value = data[key as keyof UserRegistrationInput];
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });

      // Add file if it exists
      if (selectedImage && selectedImage instanceof File) {
        formData.append('image', selectedImage);
      }

      const user = await createUser({
        userData: data,
        file: selectedImage,
      });

      if (user) {
        // Redirect to login or dashboard
        setToast({
          text: 'Successfully registered',
          type: 'success',
          status: 'block',
        });
        setTimeout(() => {
          setToast({ text: '', type: '', status: 'hidden' });
          window.location.href = '/login';
        }, 5000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setToast({
        type: 'error',
        status: 'block',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Type guard
  // const isfileObject = (value: any): value is File => {
  //   return value instanceof File;
  // };

  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Join Aqua Trail Shipping to manage your shipments efficiently.
          </p>
          <div className="text-center lg:text-left">
            Already have an account?{' '}
            <a href="/login" className="link link-primary">
              Login here
            </a>
          </div>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="name"
                className="input input-bordered"
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="email"
                className="input input-bordered"
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="password"
                className="input input-bordered"
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="phone"
                className="input input-bordered"
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.phone.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">City</span>
              </label>
              <input
                {...register('city')}
                type="text"
                placeholder="city"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <select
                {...register('country')}
                className="select select-bordered w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a country
                </option>
                {Object.values(Country).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Image</span>
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
                className="file-input file-input-bordered w-full"
              />
              {imageError && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {imageError}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
          <div className="mt-8">
            <Toast status={toast.status} text={toast.text} type={toast.type} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRegisterPage;
