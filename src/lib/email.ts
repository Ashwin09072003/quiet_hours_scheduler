import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendQuietHoursReminder(
  email: string,
  userName: string,
  blockTitle: string,
  startTime: Date
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Quiet Hours Reminder: ${blockTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">🔕 Quiet Hours Reminder</h2>
        <p>Hello ${userName},</p>
        <p>This is a friendly reminder that your quiet hours session is starting in 10 minutes!</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">${blockTitle}</h3>
          <p style="margin-bottom: 0; color: #6B7280;">
            <strong>Start Time:</strong> ${startTime.toLocaleString()}
          </p>
        </div>
        
        <p>Time to prepare for your focused study session. Find a quiet space and minimize distractions.</p>
        
        <p style="color: #6B7280; font-size: 14px;">
          Best regards,<br>
          Quiet Hours Scheduler
        </p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
