import { z } from 'zod';
import { ContainerSize, ContainerType, Country } from '@prisma/client';

export const SeafreightBookingSchema = z
  .object({
    customerId: z.string().min(1, 'Customer ID is required'),
    containerSize: z.nativeEnum(ContainerSize),
    containerType: z.nativeEnum(ContainerType),
    containerQuantity: z
      .number()
      .positive('Container quantity must be positive'),
    commodity: z.string().min(1, 'Commodity is required'),
    weight: z.number().positive('Weight must be positive'),
    dg: z.boolean(),
    unNumber: z.string().optional(),
    class: z.string().optional(),
    packingGroup: z.string().optional(),
    flashPoint: z.string().optional(),
    marinePollutant: z.boolean().optional(),
    reefer: z.boolean(),
    temperature: z.string().optional(),
    ventilation: z.string().optional(),
    humidity: z.string().optional(),
    oog: z.boolean(),
    overLength: z.string().optional(),
    overWidth: z.string().optional(),
    overHeight: z.string().optional(),
    origin: z.nativeEnum(Country),
    destination: z.nativeEnum(Country),
    pol: z.string().min(1, 'Port of Loading is required'),
    pod: z.string().min(1, 'Port of Discharge is required'),
    etd: z.date({ required_error: 'ETD is required' }),
  })
  .refine(
    (data) => {
      if (data.dg) {
        return !!(
          data.class &&
          data.unNumber &&
          data.flashPoint &&
          data.packingGroup
        );
      }
      return true;
    },
    { message: 'DG details are required when DG is true' }
  )
  .refine(
    (data) => {
      if (data.reefer) {
        return !!(data.temperature && data.ventilation && data.humidity);
      }
      return true;
    },
    { message: 'Reefer details are required when reefer is true' }
  )
  .refine(
    (data) => {
      if (data.oog) {
        return !!(data.overHeight && data.overLength && data.overWidth);
      }
      return true;
    },
    { message: 'OOG details are required when OOG is true' }
  );

export type SeafreightBookingInput = z.infer<typeof SeafreightBookingSchema>;

export const validateSeafreightBooking = (
  data: unknown
): SeafreightBookingInput => {
  try {
    const validatedData = SeafreightBookingSchema.parse(data);
    return validatedData;
  } catch (error) {
    // Re-throw the Zod error for handling by the caller
    throw error;
  }
};

export const ImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, and .webp files are accepted'
    ),
});

export type ImageInput = z.infer<typeof ImageSchema>;

export const UserRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.nativeEnum(Country).optional(),
  image: z.string().optional(),
});

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;

export const validateUserRegistration = (
  data: unknown
): UserRegistrationInput => {
  try {
    return UserRegistrationSchema.parse(data);
  } catch (error) {
    throw error;
  }
};

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type UserLoginInput = z.infer<typeof UserLoginSchema>;

export const CustomerCreationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.nativeEnum(Country, {
    errorMap: () => ({ message: 'Country is required' }),
  }),
});
export type CustomerCreationInput = z.infer<typeof CustomerCreationSchema>;
