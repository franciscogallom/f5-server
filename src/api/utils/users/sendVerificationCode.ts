import { transporter } from "../../../config/nodemailer"

export const sendVerificationCode = async (
  email: string,
  verificationCode: string
) =>
  await transporter.sendMail({
    from: '"f5" <f5@gmail.com>',
    to: email,
    subject: "🔒 Código de verificación.",
    html: `<p>Tu código de verificación es <strong>${verificationCode}</strong>.</p>`,
  })
