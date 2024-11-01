import { NextFunction, Request, Response } from "express"
import { orm } from "../../app.js"
import User from "../../entities/user.entity.js"
import EmailLogin from "../../entities/emailLogin.entity.js"
import sendMail from "../../mail.js"

const userPasswordSendTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body?.email

    if (!email) {
        res.status(400).send('Invalid parameters')
        return
    }

    const user = await orm.em.findOne(User, {email: email})

    if (user !== null) {
        const otac = new EmailLogin({email: email})

        await orm.em.persistAndFlush(otac)

        const url = process.env.BACKEND_HOST +
                    '/user/password/form' +
                    '?token=' + otac.id +
                    '&email=' + email

        await sendMail({
            from: process.env.MAILGUN_FROM!,
            to: email,
            subject: 'Password change',
            html: `You can change your password via this link: <a href="${url}">${url}</a>`
        })
    }

    res.send(`A link to change the password was send to <b>${email}</b>.`)
}

export default userPasswordSendTokenHandler
