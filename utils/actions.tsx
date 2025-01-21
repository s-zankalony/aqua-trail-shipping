'use server';
import { Country, PrismaClient } from '@prisma/client';
import type { CustomerData, BookingData, UserData } from './types';
import { generateTimeBasedId } from './helpers';
import {
  UserLoginInput,
  validateSeafreightBooking,
  validateUserRegistration,
} from './zodSchemas';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

    const userId = await getUserId();
    const newSeafreightBooking = await prisma.seaFreightBooking.create({
      data: {
        id: generateTimeBasedId(),
        userId: userId,
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

export const createUser = async ({ userData }: { userData: UserData }) => {
  const validatedUserData = validateUserRegistration(userData);

  try {
    const newUser = await prisma.user.create({
      data: {
        password: await bcrypt.hash(validatedUserData.password, 10),
        name: validatedUserData.name,
        email: validatedUserData.email,
        phone: validatedUserData.phone,
        city: validatedUserData.city,
        country: validatedUserData.country as Country,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((e) => e.message).join(', '));
    }
    throw error;
  }
};

export const login = async ({ loginData }: { loginData: UserLoginInput }) => {
  const foundUser = await prisma.user.findUnique({
    where: { email: loginData.email },
  });
  if (!foundUser) {
    throw new Error('Invalid credentials');
  }
  const passwordMatch = await bcrypt.compare(
    loginData.password,
    foundUser.password
  );
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ userId: foundUser.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  return { token, user: foundUser };
};

export const getUserId = async (): Promise<string> => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return '';
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId || '';
  } catch {
    return '';
  }
};
export const getUserData = async () => {
  const userId = await getUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// test comment
