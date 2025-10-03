'use server';
import { Country, PrismaClient } from '@prisma/client';
import type {
  CustomerData,
  BookingData,
  UserData,
  UserDataNoPassword,
} from './types';
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
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Get environment variables with validation
const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env['NEXT_PUBLIC_SUPABASE_ANON_PUBLIC'];

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required environment variables SUPABASE_URL or SUPABASE_ANON_KEY'
  );
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

const prisma = new PrismaClient();

export const findCustomers = async (search: string) => {
  if (!search) {
    return [];
  }
  try {
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
  } catch (error) {
    console.log(`Customer search error: ${error}`);
    return [];
  }
};

export const fetchAllCustomers = async () => {
  const allCustomers = await prisma.customer.findMany();
  return allCustomers;
};

export async function getCustomerById(customerId: string) {
  try {
    const booking = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    return booking;
  } catch (error) {
    console.error('Get customer data error: ', error);
    return null;
  }
}

export const createCustomer = async ({
  customerData,
}: {
  customerData: CustomerData;
}) => {
  const userId = await getUserId();
  const checkDuplicate = (await findCustomers(customerData.name)) || [];
  if (checkDuplicate.length > 0) {
    throw new Error('Customer already exists');
  }

  // Validate that the country value is a valid enum value
  const validCountry = (Object.values(Country) as string[]).includes(
    customerData.country
  );
  if (!validCountry) {
    throw new Error('Invalid country selection');
  }

  const newCustomer = await prisma.customer.create({
    data: {
      id: generateTimeBasedId(),
      name: customerData.name,
      email: customerData.email,
      address: customerData.address,
      phone: customerData.phone,
      city: customerData.city,
      country: customerData.country as Country,
      userId: userId,
    },
  });

  return newCustomer;
};

export const updateCustomer = async ({
  customerData,
}: {
  customerData: CustomerData;
}) => {
  const userId = await getUserId();
  if (!customerData.id) {
    throw new Error('Customer ID is required');
  }
  const checkCustomerExistence = await getCustomerById(customerData.id);
  if (!checkCustomerExistence) {
    throw new Error("Customer doesn't exists");
  }

  // Validate that the country value is a valid enum value
  const validCountry = (Object.values(Country) as string[]).includes(
    customerData.country
  );
  if (!validCountry) {
    throw new Error('Invalid country selection');
  }

  const newCustomer = await prisma.customer.update({
    where: { id: customerData.id },
    data: {
      name: customerData.name,
      email: customerData.email,
      address: customerData.address,
      phone: customerData.phone,
      city: customerData.city,
      country: customerData.country as Country,
      userId: userId,
    },
  });

  return newCustomer;
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
    return newSeafreightBooking;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((e) => e.message).join(', '));
    }
    throw error;
  }
};

export const updateSeafreightBooking = async ({
  bookingId,
  bookingData,
}: {
  bookingId: string;
  bookingData: BookingData;
}) => {
  try {
    // Validate the input data
    const validatedData = validateSeafreightBooking(bookingData);

    // Get current user ID
    const userId = await getUserId();

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.seaFreightBooking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    if (existingBooking.userId !== userId) {
      throw new Error('Not authorized to update this booking');
    }

    // Update the booking
    const updatedBooking = await prisma.seaFreightBooking.update({
      where: { id: bookingId },
      data: {
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
        updatedAt: new Date(),
      },
      include: {
        shipper: true,
      },
    });

    return updatedBooking;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((e) => e.message).join(', '));
    }
    throw error;
  }
};

export const getRandomBookingId = async () => {
  try {
    const totalBookings = await prisma.seaFreightBooking.count();
    if (totalBookings === 0) {
      return null;
    }

    const randomOffset = Math.floor(Math.random() * totalBookings);
    const [randomBooking] = await prisma.seaFreightBooking.findMany({
      select: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip: randomOffset,
      take: 1,
    });

    return randomBooking?.id ?? null;
  } catch (error) {
    console.error('Failed to fetch random booking id:', error);
    throw new Error('Unable to retrieve random booking at this time');
  }
};

const BUCKET_NAME = 'user-images';
const UPLOAD_FOLDER = '144gyii_1';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const validatedFile = ImageSchema.shape.file.parse(file);
    const fileExt = validatedFile.name.split('.').pop();
    const fileName = `${UPLOAD_FOLDER}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const options = {
      contentType: validatedFile.type,
      cacheControl: '3600',
      upsert: false,
    };

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, validatedFile, options);

    if (error) {
      console.error('Storage error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    if (!data) {
      throw new Error('Upload successful but no data returned');
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Image upload failed: ${message}`);
  }
};

export async function retrievePhoto({ user }: { user: UserDataNoPassword }) {
  if (!user?.image) return null;

  try {
    // const fileName = user.image.split('/').pop();
    // if (!fileName) {
    //   return null;
    // }

    // Extract the key after 'user-images/' from the full URL
    const key = user.image.split('user-images/')[1];
    if (!key) {
      return null;
    }

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false },
    });

    const { data: signedData } = await supabase.storage
      .from('user-images')
      .createSignedUrl(key, 3600);

    if (signedData?.signedUrl) {
      return signedData.signedUrl;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('user-images').getPublicUrl(key);

    if (publicUrl) {
      return publicUrl;
    }

    return null;
  } catch (error) {
    return null;
  }
}

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

    const { password: _, ...userData } = user;
    const userWithoutPassword = {
      ...userData,
      phone: userData.phone ?? undefined,
      city: userData.city ?? undefined,
      country: userData.country ?? undefined,
      image: userData.image ?? undefined,
    };
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
};

export const getUserDataById = async (userId: string) => {
  try {
    // Validate userId
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId provided: ', userId);
      return null;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    const { password: _, ...userData } = user;
    const userWithoutPassword = {
      ...userData,
      phone: userData.phone ?? undefined,
      city: userData.city ?? undefined,
      country: userData.country ?? undefined,
      image: userData.image ?? undefined,
    };
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
};

export async function getUserBookings(userId: string) {
  try {
    const bookings = await prisma.seaFreightBooking.findMany({
      where: { userId: userId },
      include: {
        shipper: true,
      },
    });
    return bookings;
  } catch (error) {
    console.error('Get bookings data error: ', error);
    return null;
  }
}
export async function getBookingById(bookingId: string) {
  try {
    const booking = await prisma.seaFreightBooking.findUnique({
      where: { id: bookingId },
      include: {
        shipper: true,
      },
    });
    // console.log(booking);
    return booking;
  } catch (error) {
    console.error('Get booking data error: ', error);
    return null;
  }
}

export async function getUserCustomers(userId: string) {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId: userId },
    });
    return customers;
  } catch (error) {
    console.error('Get bookings data error: ', error);
    return null;
  }
}

export async function protectRoute() {
  const user = (await getUserData()) || null;
  if (!user) {
    redirect('/login');
  }
  return;
}
