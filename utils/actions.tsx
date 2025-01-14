'use server';
import { containerSize, containerType, PrismaClient } from '@prisma/client';
import type { CustomerData, BookingData } from './types';
import { generateTimeBasedId } from './helpers';
import { validateSeafreightBooking } from './zodSchemas';
import { z } from 'zod';

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
  try {
    const validatedData = validateSeafreightBooking(bookingData);

    const newSeafreightBooking = await prisma.seaFreightBooking.create({
      data: {
        id: generateTimeBasedId(),
        customerId: validatedData.customerId,
        containerSize: validatedData.containerSize,
        containerType: validatedData.containerType,
        containerQuantity: validatedData.containerQuantity,
        commodity: validatedData.commodity,
        weight: validatedData.weight,
        dg: validatedData.dg,
        unNumber: validatedData.unNumber || '',
        class: validatedData.class || '',
        packingGroup: validatedData.packingGroup || '',
        flashPoint: validatedData.flashPoint || '',
        marinePollutant: validatedData.marinePollutant || false,
        reefer: validatedData.reefer,
        temperature: validatedData.temperature || '',
        ventilation: validatedData.ventilation || '',
        humidity: validatedData.humidity || '',
        oog: validatedData.oog,
        overLength: validatedData.overLength || '',
        overWidth: validatedData.overWidth || '',
        overHeight: validatedData.overHeight || '',
        origin: validatedData.origin,
        destination: validatedData.destination,
        pol: validatedData.pol,
        pod: validatedData.pod,
        etd: validatedData.etd,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((e) => e.message).join(', '));
    }
    throw error;
  }
};
