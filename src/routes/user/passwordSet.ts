import { Request, Response } from "express"
import { orm } from "../../app.js"
import User from "../../entities/user.entity.js"
import EmailLogin from "../../entities/emailLogin.entity.js"
import Credential from "../../entities/credential.entity.js"

interface Params {
    password: string,
    token: string,
    email: string
}

const userPasswordSetHandler = async (req: Request, res: Response) => {
    const {password, token, email} = req.body as Params

    if (!password || !token) {
        res.status(400).send('Invalid parameters')
        return
    }

    const otac = await orm.em.findOne(EmailLogin, {id: token, email: email})

    if (!otac) {
        res.sendStatus(401)
        return
    }

    const user = await orm.em.findOne(User, {email: email}, {populate: ['*']})

    if (!user) {
        console.error('Trying to change the password of non-existing user: ' + email)
        res.sendStatus(500)
        return
    }

    if (user.credential) {
        orm.em.remove(user.credential)
    }

    user.credential = new Credential(password)

    orm.em.remove(otac)

    await orm.em.flush()

    res.send('Password changed')
}

export default userPasswordSetHandler
