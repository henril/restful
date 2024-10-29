import Mailgun from "mailgun.js"

const sendMail = async (params: {
    from: string,
    to: string,
    subject: string,
    html: string
}) => {
    const mg = new Mailgun.default(FormData).client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY!,
        url: 'https://api.eu.mailgun.net'
    })

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html
    })
}

export default sendMail;
