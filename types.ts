
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  WORKER = 'WORKER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
}

export interface WorkerProfile extends User {
  category: string;
  experience: number;
  baseRate: number;
  serviceArea: string;
  isAvailable: boolean;
  rating: number;
  totalJobs: number;
  totalEarnings: number;
}

export interface Booking {
  id: string;
  customerId: string;
  workerId?: string;
  category: string;
  description: string;
  status: BookingStatus;
  scheduledTime: string;
  paymentMethod: 'ONLINE' | 'COD';
  cost: number;
  rating?: number;
  review?: string;
  productsUsed?: ProductUsage[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface ProductUsage {
  productId: string;
  name: string;
  quantity: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}
