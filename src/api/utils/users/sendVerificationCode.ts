import { transporter } from "../../../config/nodemailer"

export const sendVerificationCode = async (
  email: string,
  verificationCode: string
) =>
  await transporter.sendMail({
    from: '"f5" <f5@gmail.com>',
    to: email,
    subject: "🔒 Código de verificación.",
    html: `<p>Tu código de verificación es <strong>${verificationCode}</strong>.</p>
          </br>
          <p>Si no creaste una cuenta en <strong>f5</strong> o no solicitaste un cambio de email en la aplicación, ignora este mensaje.</p>
        `,
  })
