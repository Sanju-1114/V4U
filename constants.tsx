
import React from 'react';
import { 
  Wrench, 
  Trash2, 
  Hammer, 
  Paintbrush, 
  Car, 
  HeartPulse,
  Settings,
  Users,
  Briefcase,
  LayoutDashboard,
  ShoppingCart
} from 'lucide-react';

export const SERVICE_CATEGORIES = [
  { id: 'plumbing', name: 'Plumber', icon: <Wrench className="w-6 h-6" />, description: 'Expert leak fixing and piping.' },
  { id: 'cleaning', name: 'Cleaner', icon: <Trash2 className="w-6 h-6" />, description: 'Home and office deep cleaning.' },
  { id: 'carpentry', name: 'Carpenter', icon: <Hammer className="w-6 h-6" />, description: 'Furniture repair and woodwork.' },
  { id: 'painting', name: 'Painter', icon: <Paintbrush className="w-6 h-6" />, description: 'Interior and exterior wall painting.' },
  { id: 'auto', name: 'Auto-Repair', icon: <Car className="w-6 h-6" />, description: 'Vehicle maintenance and fixes.' },
  { id: 'health', name: 'Healthcare', icon: <HeartPulse className="w-6 h-6" />, description: 'In-home nursing and checkups.' },
];

export const NAV_ITEMS = {
  CUSTOMER: [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard /> },
    { name: 'Book Service', path: 'book', icon: <Briefcase /> },
    { name: 'Store', path: 'store', icon: <ShoppingCart /> },
  ],
  WORKER: [
    { name: 'My Jobs', path: 'jobs', icon: <Briefcase /> },
    { name: 'Earnings', path: 'earnings', icon: <ShoppingCart /> },
  ],
  ADMIN: [
    { name: 'Overview', path: 'overview', icon: <LayoutDashboard /> },
    { name: 'Workers', path: 'manage-workers', icon: <Users /> },
    { name: 'Settings', path: 'settings', icon: <Settings /> },
  ]
};

export const DEMO_PRODUCTS = [
  { id: 'p1', name: 'Industrial Pipe Sealant', price: 450, category: 'plumbing', imageUrl: 'https://picsum.photos/seed/pipe/200/200' },
  { id: 'p2', name: 'Eco-Friendly Cleaner', price: 200, category: 'cleaning', imageUrl: 'https://picsum.photos/seed/clean/200/200' },
  { id: 'p3', name: 'Wood Varnish Premium', price: 800, category: 'carpentry', imageUrl: 'https://picsum.photos/seed/wood/200/200' },
  { id: 'p4', name: 'Weather Guard Paint', price: 1200, category: 'painting', imageUrl: 'https://picsum.photos/seed/paint/200/200' },
  { id: 'p5', name: 'Synthetic Engine Oil', price: 1500, category: 'auto', imageUrl: 'https://picsum.photos/seed/oil/200/200' },
];
