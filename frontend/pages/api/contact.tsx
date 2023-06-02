// require('dotenv').config();  // do I actually need this?
import { render } from '@react-email/render'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as nodemailer from 'nodemailer'
import Email from '../../components/email-templates/SuccessfulJoin'
// Nodemailer docs: // https://nodemailer.com/about/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // https://nodemailer.com/smtp/
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: +process.env.EMAIL_PORT!,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    secure: false, // Default value but showing for explicitness
  })
  const emailHtml = render(<Email url='https://merkezsoft.com' />)
  const { name, email, message } = req.body

  if (!message || !name || !message) {
    return res
      .status(400)
      .json({ message: 'Please fill out the necessary fields' })
  }

  // https://nodemailer.com/message/#common-fields
  const mailData = {
    from: process.env.EMAIL_HOST_USER,
    to: email,
    subject: `Message from ${name}`,
    text: `${message} | Sent from: ${email}`,
    html: emailHtml,
    // html: `<div>${message}</div><p>Sent from: ${email}</p>`,
  }

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err: Error | null, info) => {
      if (err) {
        reject(err)
        return res
          .status(500)
          .json({ error: err.message || 'Something went wrong' })
      } else {
        resolve(info.accepted)
        res.status(200).json({ message: 'Message sent!' })
      }
    })
  })

  return
}
