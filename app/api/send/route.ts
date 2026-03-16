import { UserConfirmationTemplate, AdminNotificationTemplate } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // 1. Send Admin Notification (to lucas@bespokeapps.co.za)
    const adminEmail = await resend.emails.send({
      from: 'Bespoke Labs Admin <onboarding@resend.dev>',
      to: ['lucas@bespokeapps.co.za'],
      subject: `[New Lead] Message from ${name}`,
      react: AdminNotificationTemplate({ name, email, message }),
    });

    if (adminEmail.error) {
      console.error("Admin Email Failure:", adminEmail.error);
      return Response.json({ error: adminEmail.error }, { status: 500 });
    }

    // 2. Send User Confirmation (to the user)
    const userEmail = await resend.emails.send({
      from: 'Bespoke Labs <onboarding@resend.dev>',
      to: [email],
      subject: 'We received your message!',
      react: UserConfirmationTemplate({ firstName: name }),
    });

    if (userEmail.error) {
      console.warn("User Confirmation Failure (non-critical):", userEmail.error);
      // We don't necessarily want to fail the whole request if the confirmation fails
      // but the admin notification succeeded.
    }

    return Response.json({ status: 'sent', adminId: adminEmail.data?.id });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return Response.json({ error }, { status: 500 });
  }
}
