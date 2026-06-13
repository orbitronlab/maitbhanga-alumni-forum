import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserRole, UserStatus } from '@prisma/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { profile: true },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        if (user.status === UserStatus.SUSPENDED) {
          throw new Error('Your account has been suspended. Contact admin.');
        }

        if (user.status === UserStatus.PENDING) {
          throw new Error('Your account is pending approval. Please wait for verification.');
        }

        if (user.status === UserStatus.INACTIVE) {
          throw new Error('Your account is inactive. Contact admin.');
        }

        // Check login attempts
        if (user.loginAttempts >= 5) {
          throw new Error('Account locked due to too many failed attempts. Contact admin.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          // Increment login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: { increment: 1 } },
          });
          throw new Error('Invalid email or password');
        }

        // Reset login attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.fullName ?? user.email,
          role: user.role,
          status: user.status,
          image: user.profile?.profilePhoto ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // Log new user registration
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'CREATE',
            entityType: 'User',
            entityId: user.id,
            metadata: { event: 'oauth_registration' },
          },
        });
      }
    },
  },
});
