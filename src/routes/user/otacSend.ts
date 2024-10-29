import { Request, Response } from "express"
import { orm } from "../../app.js"
import EmailLogin from "../../entities/emailLogin.entity.js"
import sendMail from "../../mail.js"
import User from "../../entities/user.entity.js"

const userOtacSendHandler = async (req: Request, res: Response) => {
    const email = req.body?.email

    if (!email) {
        res.status(400).send('Invalid parameters')
        return
    }

    const user = await orm.em.findOne(User, {email: email})

    if (user !== null) {
        // The new login code will deprecate any existing one for this email address.
        await orm.em.nativeDelete(EmailLogin, {email: email})

        const emailLogin = new EmailLogin({email: email})
        await orm.em.persistAndFlush(emailLogin)

        const loginUrl = process.env.BACKEND_HOST
                            + '/user/otac/login'
                            + '?id=' + emailLogin.id
                            + '&email=' + email

        await sendMail({
            from: process.env.MAILGUN_FROM!,
            to: email,
            subject: 'Login link',
            html: `Click the link to log in: <a href="${loginUrl}">${loginUrl}</a>`
        })
    }

    res.send(`You may now log in by clicking the link sent to <b>${email}</b>.`)
}

export default userOtacSendHandler
