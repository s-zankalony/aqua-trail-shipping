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
