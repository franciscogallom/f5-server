import { transporter } from "../../../config/nodemailer"

export const sendEmailToRequestInscription = async (
  name: string,
  email: string,
  location: string,
  phone: string
) =>
  await transporter.sendMail({
    from: '"f5" <f5@gmail.com>',
    to: "frangallofran@gmail.com",
    subject: "🆕 Solicitud de inscripción.",
    html: ` <p>Nombre del complejo: <strong>${name}</strong>.</p>
            <p>Email de contacto: <strong>${email}</strong>.</p>
            <p>Dirección: <strong>${location}</strong>.</p>
            <p>Número de celular: <strong>${phone}</strong>.</p>
    `,
  })
