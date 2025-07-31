import nodemailer, { type SendMailOptions } from 'nodemailer'

export async function sendEmail({
  to,
  subject,
  body,
  replyTo = undefined,
}: {
  to: string
  subject: string
  body: string
  replyTo?: string
}) {
  const { mailHost, mailUser, mailPass, mailFrom } = useRuntimeConfig()

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

  if (replyTo) {
    mailOptions.replyTo = replyTo
  }

  return await transport.sendMail(mailOptions)
}
