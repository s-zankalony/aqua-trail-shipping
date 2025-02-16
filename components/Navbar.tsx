import Image from 'next/image';
import ThemeSwitch from './ThemeSwitch';
import logo from '@/public/images/aqua-trail-shipping.jpg';
import { links } from '@/utils/links';
import Avatar from './Avatar';
import { getUserData } from '@/utils/actions';

async function Navbar() {
  const user = await getUserData();
  return (
    <div className="navbar bg-base-100 menu menu-vertical md:menu-horizontal">
      <div className="flex-1 justify-start items-center">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex">
          <Image
            src={logo}
            alt="logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <a className="btn btn-ghost text-xl" href="/">
            Aqua Trail Company
          </a>
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="flex-1">
          <ul className="menu menu-horizontal px-1">
            {links.map((link) => {
              const { id, name, dest } = link;
              return (
                <li key={id}>
                  <a href={dest} className="link link-hover">
                    {name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex-none">
          <ThemeSwitch />
        </div>
        <Avatar key={user ? user.id : 'guest'} />
      </div>
    </div>
  );
}
export default Navbar;
