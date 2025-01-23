'use server';
import { Country, PrismaClient } from '@prisma/client';
import type { CustomerData, BookingData, UserData } from './types';
import { generateTimeBasedId } from './helpers';
import {
  ImageSchema,
  UserLoginInput,
  validateSeafreightBooking,
  validateUserRegistration,
} from './zodSchemas';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_PUBLIC'
  );
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

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

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // 1. Validate the file
    const validatedFile = ImageSchema.shape.file.parse(file);
    console.log('File validated successfully');

    // 2. Get file extension and generate filename
    const fileExt = validatedFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // 3. Create file options with proper content type
    const options = {
      contentType: validatedFile.type,
      cacheControl: '3600',
      upsert: false,
    };

    // 4. Upload with proper error handling
    const { data, error } = await supabase.storage
      .from('user-images')
      .upload(fileName, validatedFile, options);

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    if (!data) {
      throw new Error('Upload successful but no data returned');
    }

    // 5. Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('user-images').getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    if (error instanceof Error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
    throw new Error('Image upload failed with unknown error');
  }
};

export const createUser = async ({
  userData,
  file,
}: {
  userData: UserData;
  file?: File | null;
}) => {
  const validatedUserData = validateUserRegistration(userData);

  try {
    let imagePath = '';
    if (file && isFileObject(file)) {
      imagePath = await uploadImage(file);
    }

    const newUser = await prisma.user.create({
      data: {
        password: await bcrypt.hash(validatedUserData.password, 10),
        name: validatedUserData.name,
        email: validatedUserData.email,
        phone: validatedUserData.phone,
        city: validatedUserData.city,
        country: validatedUserData.country as Country,
        image: imagePath,
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

// Helper function to check if value is File
function isFileObject(value: any): value is File {
  return value instanceof File;
}

// login function
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

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: false, // Allow JS access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour in seconds
    path: '/',
  });

  const { password: _, ...userWithoutPassword } = foundUser;

  return { success: true, user: userWithoutPassword };
};

export const logout = async (): Promise<{ success: boolean }> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
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
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
};
