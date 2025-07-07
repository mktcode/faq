import nodemailer, { type SendMailOptions } from 'nodemailer'

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  const { mailHost, mailUser, mailPass, mailFrom } = useRuntimeConfig()

  console.log('Sending email:', {
    to,
    subject,
    body,
    mailHost,
    mailUser,
    mailPass,
    mailFrom,
  })

  const transport = nodemailer.createTransport({
    host: mailHost,
    port: 587,
    secure: false,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  })

  const mailOptions: SendMailOptions = {
    from: mailFrom,
    to,
    subject,
    text: body,
  }

  return await transport.sendMail(mailOptions)
}
