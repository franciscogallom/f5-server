import { transporter } from "../../../config/nodemailer"

export const sendEmailToRequestInscription = async (
  name: string,
  location: string,
  phone: string,
  price: string
) =>
  await transporter.sendMail({
    from: '"f5" <f5@gmail.com>',
    to: "frangallofran@gmail.com",
    subject: "🆕 Solicitud de inscripción.",
    html: ` <p>Nombre: <strong>${name}</strong>.</p>
            <p>Ubicación: <strong>${location}</strong>.</p>
            <p>Precio del turno: <strong>$${price}</strong>.</p>
            <p>Número de celular: <strong>${phone}</strong>.</p>
    `,
  })
