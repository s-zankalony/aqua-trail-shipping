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
  if (
    !bookingData ||
    !bookingData.customerId ||
    !bookingData.containerSize ||
    !bookingData.containerType ||
    !bookingData.containerQuantity ||
    !bookingData.commodity ||
    !bookingData.weight ||
    bookingData.dg === undefined ||
    bookingData.reefer === undefined ||
    bookingData.oog === undefined ||
    !bookingData.origin ||
    !bookingData.destination ||
    !bookingData.pol ||
    !bookingData.pod ||
    !bookingData.etd
  ) {
    throw new Error('Please complete all required booking data fields');
  }
  if (
    bookingData.dg &&
    (!bookingData.class ||
      !bookingData.unNumber ||
      !bookingData.flashPoint ||
      !bookingData.packingGroup)
  ) {
    throw new Error('Pls complete DG details');
  }
  if (
    (bookingData.class ||
      bookingData.unNumber ||
      bookingData.flashPoint ||
      bookingData.packingGroup) &&
    !bookingData.dg
  ) {
    throw new Error(
      'Pls recheck DG details. Shipment is not marked as DG but there is DG data inserted'
    );
  }
  if (
    bookingData.reefer &&
    (!bookingData.temperature ||
      !bookingData.ventilation ||
      !bookingData.humidity)
  ) {
    throw new Error('Pls complete reefer details');
  }
  if (
    !bookingData.reefer &&
    (bookingData.temperature || bookingData.ventilation || bookingData.humidity)
  ) {
    throw new Error(
      'Pls recheck reefer details. Shipment is not marked as reefer but there is reefer data inserted.'
    );
  }
  if (
    bookingData.oog &&
    (!bookingData.overHeight ||
      !bookingData.overLength ||
      !bookingData.overWidth)
  ) {
    throw new Error('Pls complete OOG details');
  }
  if (
    !bookingData.oog &&
    (bookingData.overHeight || bookingData.overLength || bookingData.overWidth)
  ) {
    throw new Error(
      'Pls recheck OOG details. Shipment is not marked as OOG, but there is OOG data inserted.'
    );
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
      dg: bookingData.dg || false,
      unNumber: bookingData.unNumber || '',
      class: bookingData.class || '',
      packingGroup: bookingData.packingGroup || '',
      flashPoint: bookingData.flashPoint || '',
      marinePollutant: bookingData.marinePollutant || false,
      reefer: bookingData.reefer || false,
      temperature: bookingData.temperature || '',
      ventilation: bookingData.ventilation || '',
      humidity: bookingData.humidity || '',
      oog: bookingData.oog || false,
      overLength: bookingData.overLength || '',
      overWidth: bookingData.overWidth || '',
      overHeight: bookingData.overHeight || '',
      origin: bookingData.origin,
      destination: bookingData.destination,
      pol: bookingData.pol,
      pod: bookingData.pod,
      etd: bookingData.etd,
    },
  });
};
