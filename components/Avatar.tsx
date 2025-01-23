'use client';
import { logout } from '@/utils/actions';
import { useAuth } from './useAuth';

function Avatar() {
  const { user, loading } = useAuth();

  console.log('User: ', user);

  if (loading) {
    return (
      <div className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full animate-pulse bg-gray-200" />
      </div>
    );
  }

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
            src={
              user?.image
                ? user.image
                : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            }
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          {user ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
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
