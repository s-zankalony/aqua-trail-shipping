import { nanoid } from 'nanoid';

export const links = [
  {
    id: nanoid(),
    name: 'Home',
    dest: '/',
  },
  {
    id: nanoid(),
    name: 'About',
    dest: '/about',
  },
  {
    id: nanoid(),
    name: 'Services',
    dest: '/services',
  },
  {
    id: nanoid(),
    name: 'Contact Us',
    dest: '/contactUs',
  },
];
