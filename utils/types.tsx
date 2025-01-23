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
};
export type CustomerData = {
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
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  active?: boolean;
  role?: string;
  image?: string;
};
