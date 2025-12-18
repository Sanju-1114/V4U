
import { UserRole, BookingStatus, WorkerProfile, Booking, User } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.CUSTOMER,
  location: 'New York, Manhattan'
};

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w1',
    name: 'Robert Fixit',
    email: 'robert@v4u.com',
    role: UserRole.WORKER,
    category: 'Plumber',
    experience: 8,
    baseRate: 50,
    serviceArea: 'Manhattan',
    isAvailable: true,
    rating: 4.8,
    totalJobs: 142,
    totalEarnings: 8500
  },
  {
    id: 'w2',
    name: 'Sarah Clean',
    email: 'sarah@v4u.com',
    role: UserRole.WORKER,
    category: 'Cleaner',
    experience: 5,
    baseRate: 40,
    serviceArea: 'Brooklyn',
    isAvailable: true,
    rating: 4.2,
    totalJobs: 98,
    totalEarnings: 4200
  },
  {
    id: 'w3',
    name: 'Mike Hammer',
    email: 'mike@v4u.com',
    role: UserRole.WORKER,
    category: 'Carpenter',
    experience: 12,
    baseRate: 70,
    serviceArea: 'Queens',
    isAvailable: true,
    rating: 4.9,
    totalJobs: 210,
    totalEarnings: 15400
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    customerId: 'u1',
    workerId: 'w1',
    category: 'Plumber',
    description: 'Leaking kitchen tap needs urgent fixing.',
    status: BookingStatus.COMPLETED,
    scheduledTime: '2023-10-25T10:00',
    paymentMethod: 'ONLINE',
    cost: 60,
    rating: 5,
    review: 'Excellent service, very professional.',
    productsUsed: [{ productId: 'p1', name: 'Industrial Pipe Sealant', quantity: 1 }]
  },
  {
    id: 'b2',
    customerId: 'u1',
    category: 'Cleaner',
    description: 'Full house cleaning before moving out.',
    status: BookingStatus.PENDING,
    scheduledTime: '2023-11-01T09:00',
    paymentMethod: 'COD',
    cost: 40
  }
];
