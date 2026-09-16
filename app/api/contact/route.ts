import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message fields are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address provided.' },
        { status: 400 }
      );
    }

    // [ADD EMAIL SERVICE INTEGRATION — e.g. Resend, SendGrid, Postmark, or Supabase DB]
    // Example with Resend:
    // await resend.emails.send({ from: 'onboarding@resend.dev', to: 'fiker@example.com', subject: `FIKER OS Connection from ${name}`, text: message });

    console.log(`[FIKER OS TRANSMISSION RECEIVED] From: ${name} (${email})\nMessage: ${message}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Packet transmission received successfully.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to process message transmission.' },
      { status: 500 }
    );
  }
}
