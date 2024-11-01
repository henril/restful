import { NextFunction, Request, Response } from "express"

const userPasswordFormHandler = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token?.toString()
    const email = req.query.email?.toString()

    if (!token || !email) {
        res.status(400).send('Invalid parameters')
        return
    }

    res.send(
        '<form action="/user/password/set" method="post">' +
        'New password: <input name="password" type="password"><br>' +
        `<input name="email" value="${email}" type="hidden">` +
        `<input name="token" value="${token}" type="hidden">` +
        '<input type="submit" value="Set password">' +
        '</form>'
    )
}

export default userPasswordFormHandler
