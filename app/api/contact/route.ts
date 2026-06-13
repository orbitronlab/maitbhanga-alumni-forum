import { NextResponse } from 'next/server';
import { ContactSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { name, email, subject, message } = parsed.data;

    // Store in DB as a notification to admins
    const admins = await prisma.user.findMany({ where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] }, status: 'ACTIVE' } });
    await Promise.all(admins.map(admin =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'SYSTEM',
          title: `Contact Form: ${subject}`,
          body: `From: ${name} (${email})\n\n${message}`,
        },
      })
    ));

    return NextResponse.json({ message: 'Your message has been sent. We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
