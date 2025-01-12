'use server';
import { containerSize, containerType, PrismaClient } from '@prisma/client';
import type { CustomerData, BookingData } from './types';
import { generateTimeBasedId } from './helpers';
import Toast from '@/components/Toast';
import { text } from 'stream/consumers';

const prisma = new PrismaClient();

export const findCustomers = async (search: string) => {
  if (!search) {
    return '';
  }
  const searchResults = await prisma.customer.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
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

export const createSeafreightBooking = async ({
  bookingData,
}: {
  bookingData: BookingData;
}) => {
  if (!bookingData) {
    throw new Error('Pls complete all booking data');
  }
  const newSeafreightBooking = await prisma.seaFreightBooking.create({
    data: {
      id: generateTimeBasedId(),
      customerId: bookingData.customerId,
      containerSize: bookingData.containerSize as containerSize,
      containerType: bookingData.containerType as containerType,
      containerQuantity: bookingData.containerQuantity,
      commodity: bookingData.commodity,
      weight: bookingData.weight,
      dg: bookingData.dg,
      reefer: bookingData.reefer,
      oog: bookingData.oog,
      origin: bookingData.origin,
      destination: bookingData.destination,
      pol: bookingData.pol,
      pod: bookingData.pod,
      etd: bookingData.etd,
    },
  });
};
