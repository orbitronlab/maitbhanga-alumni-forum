import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency = 'BDT'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (currency === 'BDT') {
    return `৳${num.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
}

export function formatDate(date: Date | string, fmt = 'dd MMM yyyy'): string {
  return format(new Date(date), fmt);
}

export function formatDateRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateProgress(raised: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export function generateReceiptNumber(): string {
  const prefix = 'MAF';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}-${year}-${random}`;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-3);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const masked = local.slice(0, 2) + '***' + local.slice(-1);
  return `${masked}@${domain}`;
}

export function isValidBangladeshPhone(phone: string): boolean {
  const regex = /^(\+880|880|0)(1[3-9]\d{8})$/;
  return regex.test(phone.replace(/\s/g, ''));
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const offset = (page - 1) * perPage;
  const paginatedItems = items.slice(offset, offset + perPage);

  return {
    items: paginatedItems,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      perPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export const DONATION_TYPES = {
  MEMBERSHIP_FEE: 'Membership Fee',
  EVENT_FEE: 'Event Fee',
  GENERAL_DONATION: 'General Donation',
  DEVELOPMENT_FUND: 'Development Fund',
  CAMPAIGN_DONATION: 'Campaign Donation',
} as const;

export const PAYMENT_METHODS = {
  BKASH: 'bKash',
  NAGAD: 'Nagad',
  SSLCOMMERZ: 'SSLCommerz',
  BANK_TRANSFER: 'Bank Transfer',
  CASH: 'Cash',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ALUMNI: 'Alumni Member',
  GUEST: 'Guest',
} as const;
