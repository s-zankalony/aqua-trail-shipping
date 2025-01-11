'use server';
import { PrismaClient } from '@prisma/client';
import type { CustomerData } from './types';
import { generateTimeBasedId } from './helpers';
import Toast from '@/components/Toast';
import { text } from 'stream/consumers';

const prisma = new PrismaClient();

export const findCustomers = async (search: string) => {
  const searchResults = await prisma.customer.findMany({
    where: {
      name: search,
    },
    take: 5,
  });
  return searchResults;
};

export const fetchAllCustomers = async () => {
  const allCustomers = await prisma.customer.findMany();
  return allCustomers;
};

export const createCustomer = async ({
  customerData,
}: {
  customerData: CustomerData;
}) => {
  const checkDuplicate = await findCustomers(customerData.name);
  if (checkDuplicate.length > 0) {
    throw new Error('Customer already exist');
  }
  const newCustomer = await prisma.customer.create({
    data: {
      id: generateTimeBasedId(),
      name: customerData.name,
      email: customerData.email,
      address: customerData.address,
      phone: customerData.phone,
      city: customerData.city,
      country: customerData.country,
    },
  });
};
