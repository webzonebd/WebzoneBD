import { UserRole } from '../types';

export interface PreseededUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  avatar: string;
  isVerified: boolean;
  isSocial: boolean;
  createdAt: string;
  status: 'active';
  wishlistedProductIds: string[];
}

export const PRESEEDED_USERS: PreseededUser[] = [
  {
    id: 'usr-webzonebd-admin',
    name: 'WebzoneBD Admin Office',
    username: 'webzonebd',
    email: 'webzonebd@yahoo.com',
    phone: '+8801864000123',
    role: 'admin',
    password: 'admin123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-06-10',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-admin',
    name: 'WebzoneBD Admin Boss',
    username: 'admin',
    email: 'admin@webzonebd.com',
    phone: '+8801864000005',
    role: 'admin',
    password: 'adminpassword',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-01-10',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-101',
    name: 'Imran Hasan',
    username: 'imranh',
    email: 'customer@webzonebd.com',
    phone: '+8801700000001',
    role: 'customer',
    password: 'customerpassword',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-03-15',
    status: 'active',
    wishlistedProductIds: ['prod-1', 'prod-3']
  },
  {
    id: 'usr-101-p',
    name: 'Imran Hasan',
    username: 'imranh_primary',
    email: 'imranh7900@gmail.com',
    phone: '+8801711223344',
    role: 'customer',
    password: 'customerpassword',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-01-15',
    status: 'active',
    wishlistedProductIds: ['prod-1']
  },
  {
    id: 'usr-102',
    name: 'Al-Shehri Majid',
    username: 'majid',
    email: 'majid@saudiweb.com',
    phone: '+966501234567',
    role: 'customer',
    password: 'customerpassword',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-02-20',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-103',
    name: 'Zeeshan Rahman',
    username: 'zeeshan',
    email: 'zee@rahmanit.com',
    phone: '+8801864051151',
    role: 'customer',
    password: 'customerpassword',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-03-05',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-104',
    name: 'Sarah Connor',
    username: 'sarah',
    email: 'sarah@t800.io',
    phone: '+14158889999',
    role: 'customer',
    password: 'customerpassword',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-03-12',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-105',
    name: 'Enamul Haque',
    username: 'enamul',
    email: 'enamul@dhakahost.net',
    phone: '+8801912345678',
    role: 'customer',
    password: 'customerpassword',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2025-11-10',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-vendor',
    name: 'Al-Madina Soft Tech',
    username: 'vendor_madina',
    email: 'vendor@webzonebd.com',
    phone: '+966570511931',
    role: 'vendor',
    password: 'vendorpassword',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-04-01',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-staff',
    name: 'Rashedul Islam',
    username: 'staff_rashed',
    email: 'staff@webzonebd.com',
    phone: '+8801860000002',
    role: 'staff',
    password: 'staffpassword',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-05-15',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-order-mgr',
    name: 'Order Operations Manager',
    username: 'sales_manager',
    email: 'sales@webzonebd.com',
    phone: '+8801864000789',
    role: 'order_manager',
    password: 'sales789',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-04-10',
    status: 'active',
    wishlistedProductIds: []
  },
  {
    id: 'usr-order-mgr-alias',
    name: 'Order Operations Manager',
    username: 'orders_manager',
    email: 'orders@webzonebd.com',
    phone: '+8801864000789',
    role: 'order_manager',
    password: 'sales789',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    isSocial: false,
    createdAt: '2026-04-10',
    status: 'active',
    wishlistedProductIds: []
  }
];
