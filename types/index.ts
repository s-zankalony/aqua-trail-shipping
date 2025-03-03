export interface Shipper {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface Booking {
  id: string;
  shipper: Shipper;
  containerType: string;
  containerSize: 'TWENTY_FT' | 'FORTY_FT';
  containerQuantity: number;
  commodity: string;
  weight: number;

  // DG (Dangerous Goods)
  dg: boolean;
  unNumber?: string | null;
  class?: string | null;
  packingGroup?: string | null;
  flashPoint?: string | null;
  marinePollutant?: boolean | null;

  // Reefer
  reefer: boolean;
  temperature?: string | null;
  ventilation?: string | null;
  humidity?: string | null;

  // OOG (Out of Gauge)
  oog: boolean;
  overLength?: string | null;
  overWidth?: string | null;
  overHeight?: string | null;

  // Route information
  origin: string;
  destination: string;
  pol: string;
  pod: string;
  etd: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  // Add other user properties as needed
}

// Added types from utils/types.tsx
export type ServiceCardType = {
  id: string;
  img: string;
  title: string;
  desc: string;
  page: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
};

export type CustomerData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export type BookingData = {
  customerId: string;
  customerName?: string;
  containerType: string;
  containerSize: string;
  containerQuantity: number;
  commodity: string;
  weight: number;
  dg: boolean;
  unNumber?: string;
  class?: string;
  packingGroup?: string;
  flashPoint?: string;
  marinePollutant?: boolean;
  reefer: boolean;
  temperature?: string;
  ventilation?: string;
  humidity?: string;
  oog: boolean;
  overLength?: string;
  overWidth?: string;
  overHeight?: string;
  origin: string;
  destination: string;
  pol: string;
  pod: string;
  etd: Date;
};

export type UserData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  country?: string;
  active?: boolean;
  role?: string;
  image?: string;
};

export type UserDataNoPassword = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  active?: boolean;
  role?: string;
  image?: string;
};
