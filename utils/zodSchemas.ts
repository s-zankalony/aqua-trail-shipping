import { z } from 'zod';
import { containerSize, containerType } from '@prisma/client';

export const SeafreightBookingSchema = z
  .object({
    customerId: z.string().min(1, 'Customer ID is required'),
    containerSize: z.nativeEnum(containerSize),
    containerType: z.nativeEnum(containerType),
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
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required'),
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
