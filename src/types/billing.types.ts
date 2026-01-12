export interface CustomerAddress {
  _id: string;
  text: string;
  isDefault: boolean;
}

export interface Customer {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCustomerResponse {
  message: string;
  customer: Customer;
}

export interface GetCustomerResponse {
  message: string;
  customer: Customer;
}

export interface AddAddressPayload {
  text: string;
  isDefault: boolean;
}

export interface UpdateAddressPayload {
  text: string;
  isDefault: boolean;
}

export interface AddressResponse {
  message: string;
  customer: Customer;
}
