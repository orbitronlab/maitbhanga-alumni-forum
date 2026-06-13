import { z } from 'zod';

// ─────────────────────────────────────────────
// AUTH SCHEMAS
// ─────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .min(6, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  batchYear: z
    .union([z.number().int().min(1950).max(new Date().getFullYear()), z.nan()])
    .optional()
    .transform((v) => (typeof v === 'number' && !isNaN(v) ? v : undefined)),
  passingYear: z
    .union([z.number().int().min(1950).max(new Date().getFullYear()), z.nan()])
    .optional()
    .transform((v) => (typeof v === 'number' && !isNaN(v) ? v : undefined)),
  rollNumber: z.string().max(20).optional().or(z.literal('')),
  agreeToTerms: z.boolean().refine((v) => v === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─────────────────────────────────────────────
// PROFILE SCHEMAS
// ─────────────────────────────────────────────

export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100),
  nameInBangla: z.string().max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  altPhone: z.string().optional(),
  bio: z.string().max(1000).optional(),
  rollNumber: z.string().max(20).optional(),
  passingYear: z.number().int().min(1950).max(new Date().getFullYear()).optional(),
  currentAddress: z.string().max(500).optional(),
  permanentAddress: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  profession: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  designation: z.string().max(200).optional(),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

// ─────────────────────────────────────────────
// EVENT SCHEMAS
// ─────────────────────────────────────────────

export const EventSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  shortDescription: z.string().max(500).optional(),
  type: z.enum(['REUNION', 'SEMINAR', 'FUNDRAISER', 'SPORTS', 'CULTURAL', 'OTHER']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().max(500).optional(),
  onlineLink: z.string().url().optional().or(z.literal('')),
  maxAttendees: z.number().int().positive().optional(),
  registrationFee: z.number().min(0).optional(),
  requiresPayment: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

// ─────────────────────────────────────────────
// DONATION SCHEMAS
// ─────────────────────────────────────────────

export const DonationSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').min(10, 'Minimum donation is ৳10'),
  type: z.enum(['MEMBERSHIP_FEE', 'EVENT_FEE', 'GENERAL_DONATION', 'DEVELOPMENT_FUND', 'CAMPAIGN_DONATION']),
  paymentMethod: z.enum(['BKASH', 'NAGAD', 'SSLCOMMERZ', 'BANK_TRANSFER', 'CASH']),
  campaignId: z.string().optional(),
  eventId: z.string().optional(),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
});

// ─────────────────────────────────────────────
// NEWS SCHEMAS
// ─────────────────────────────────────────────

export const NewsSchema = z.object({
  title: z.string().min(5).max(300),
  content: z.string().min(20),
  excerpt: z.string().max(500).optional(),
  category: z.string().max(50).default('general'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  isNotice: z.boolean().default(false),
});

// ─────────────────────────────────────────────
// CAMPAIGN SCHEMAS
// ─────────────────────────────────────────────

export const CampaignSchema = z.object({
  title: z.string().min(5).max(300),
  description: z.string().min(20),
  goal: z.number().positive().min(100, 'Goal must be at least ৳100'),
  currency: z.string().default('BDT'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
});

// ─────────────────────────────────────────────
// MESSAGE SCHEMAS
// ─────────────────────────────────────────────

export const MessageSchema = z.object({
  subject: z.string().min(3).max(200),
  body: z.string().min(10),
  type: z.enum(['BROADCAST', 'BATCH', 'INDIVIDUAL']),
  recipientIds: z.array(z.string()).optional(),
  batchIds: z.array(z.string()).optional(),
});

// ─────────────────────────────────────────────
// CONTACT SCHEMA
// ─────────────────────────────────────────────

export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

// ─────────────────────────────────────────────
// PAGINATION SCHEMA
// ─────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type EventInput = z.infer<typeof EventSchema>;
export type DonationInput = z.infer<typeof DonationSchema>;
export type NewsInput = z.infer<typeof NewsSchema>;
export type CampaignInput = z.infer<typeof CampaignSchema>;
export type MessageInput = z.infer<typeof MessageSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
