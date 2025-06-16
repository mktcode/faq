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
  const { mailhost, mailuser, mailpass, mailfrom } = useRuntimeConfig()

  const transport = nodemailer.createTransport({
    host: mailhost,
    port: 587,
    secure: false,
    auth: {
      user: mailuser,
      pass: mailpass,
    },
  })

  const mailOptions: SendMailOptions = {
    from: mailfrom,
    to,
    subject,
    text: body,
  }

  return await transport.sendMail(mailOptions)
}
