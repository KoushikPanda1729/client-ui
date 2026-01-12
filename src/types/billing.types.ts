export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Customer {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: Address[];
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
