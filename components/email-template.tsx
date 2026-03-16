import * as React from 'react';

interface UserConfirmationTemplateProps {
  firstName: string;
}

export function UserConfirmationTemplate({ firstName }: UserConfirmationTemplateProps) {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      lineHeight: '1.5',
      color: '#0a0a14',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px'
    }}>
      <h1 style={{ color: '#4ecdc4', marginBottom: '24px' }}>Welcome, {firstName}!</h1>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p>Thank you for reaching out to Bespoke Applications Labs. We have received your message and will get back to you shortly.</p>
      </div>
      <div style={{ marginTop: '24px', fontSize: '12px', color: '#64748b' }}>
        Sent from Bespoke Applications Labs Website
      </div>
    </div>
  );
}

interface AdminNotificationTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function AdminNotificationTemplate({ name, email, message }: AdminNotificationTemplateProps) {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      lineHeight: '1.5',
      color: '#0a0a14',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px'
    }}>
      <h1 style={{ color: '#4ecdc4', marginBottom: '24px' }}>New Contact Message</h1>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
          <p><strong>Message:</strong></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
        </div>
      </div>
      <div style={{ marginTop: '24px', fontSize: '12px', color: '#64748b' }}>
        Sent from Bespoke Applications Labs Website
      </div>
    </div>
  );
}
