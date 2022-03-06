import { transporter } from "../../../config/nodemailer"

export const sendMail = async (email: string, newPassword: string) =>
  await transporter.sendMail({
    from: '"f5" <f5@gmail.com>',
    to: email,
    subject: "🆕 Nueva contraseña.",
    html: `<p>Tu nueva contraseña es <strong>${newPassword}</strong>.<br>Te recomendamos <strong>cambiarla lo antes posible</strong>.</p>`,
  })
