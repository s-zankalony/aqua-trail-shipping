'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginSchema, UserLoginInput } from '@/utils/zodSchemas';
import { login } from '@/utils/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Toast from '@/components/Toast';
import { useAuth } from '@/components/useAuth';

function LoginPage() {
  const router = useRouter();
  const { revalidate } = useAuth();
  const [previousPath, setPreviousPath] = useState<string>('/');
  const [toast, setToast] = useState({
    text: '',
    type: '',
    status: 'hidden',
  });

  useEffect(() => {
    // Get the previous path from document referrer
    const referrer = document.referrer;
    // Check if referrer is from the same origin
    if (referrer && referrer.startsWith(window.location.origin)) {
      const path = new URL(referrer).pathname;
      // Don't set login or register paths as previous path
      if (path !== '/login' && path !== '/register') {
        setPreviousPath(path);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginInput>({ resolver: zodResolver(UserLoginSchema) });

  const onSubmit = async (data: UserLoginInput) => {
    // Handle login logic here
    try {
      const response = await login({ loginData: data });
      if (response.success) {
        setToast({
          text: 'Login successful!',
          type: 'success',
          status: 'block',
        });
        await revalidate();
        router.refresh();
        setTimeout(() => router.push(previousPath), 100);
      }
    } catch (error) {
      setToast({
        text: error instanceof Error ? error.message : 'Login failed',
        type: 'error',
        status: 'block',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                {...register('email')}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                {...register('password')}
                required
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>
            <div className="card-actions justify-end mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <div className="text-center mt-4">
              Don't have an account?{' '}
              <a href="/register" className="link link-primary">
                Register here
              </a>
            </div>
          </form>
          <Toast text={toast.text} type={toast.type} status={toast.status} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
