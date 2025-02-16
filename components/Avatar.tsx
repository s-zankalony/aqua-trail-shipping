'use client';
import { logout, retrievePhoto } from '@/utils/actions';
import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';

function Avatar() {
  const { user, loading, logout: handleLogout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0); // Add a render trigger

  useEffect(() => {
    // Force a re-render when the user object becomes available
    if (user) {
      setRenderTrigger((prev) => prev + 1);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function fetchAvatar() {
      if (user?.image) {
        try {
          const publicUrl = await retrievePhoto({ user });
          if (isMounted) {
            if (publicUrl) {
              setAvatarUrl(publicUrl);
              setImageError(false);
            } else {
              setImageError(true);
            }
          }
        } catch (error) {
          if (isMounted) {
            setImageError(true);
          }
        }
      } else {
        if (isMounted) {
          setAvatarUrl(null);
          setImageError(false);
        }
      }
    }

    if (user) {
      fetchAvatar();
    }
    return () => {
      isMounted = false;
    };
  }, [user, renderTrigger]);

  if (loading) {
    return (
      <div className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full animate-pulse bg-gray-200" />
      </div>
    );
  }

  const fallbackImage = '/images/aqua-trail-shipping.jpg';

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt={user ? `${user.name}'s avatar` : 'Default avatar'}
            src={!imageError && avatarUrl ? avatarUrl : fallbackImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.error('Image load error:', {
                attemptedSrc: target.src,
                timestamp: new Date().toISOString(),
                userName: user?.name,
                userEmail: user?.email,
                storedImagePath: user?.image,
                error: e.type,
              });
              setImageError(true);
              target.src = fallbackImage;
            }}
            className="object-cover"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        {user && (
          <>
            <li>
              <a
                href={`/profile/${user.id}/bookings`}
                className="justify-between"
              >
                My Bookings
              </a>
            </li>
            <li>
              <a
                href={`/profile/${user.id}/customers`}
                className="justify-between"
              >
                My Customers
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
          </>
        )}
        <li>
          {user ? (
            <a
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                await handleLogout();
              }}
            >
              Logout
            </a>
          ) : (
            <a href="/login">Login/Register</a>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Avatar;
