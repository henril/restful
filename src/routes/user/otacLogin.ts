import { NextFunction, Request, Response } from "express"
import { orm } from "../../app.js"
import EmailOtac from "../../entities/emailLogin.entity.js"
import User from "../../entities/user.entity.js"

const userOtacLoginHandler = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id?.toString()
    const email = req.query.email?.toString()

    if (!id || !email) {
        res.status(400).send('Bad parameters')
    }

    try {
        const login = await orm.em.findOne(EmailOtac, {id: id, email: email})

        if (!login) {
            res.sendStatus(401)
            return
        }

        await orm.em.removeAndFlush(login)

        const user = await orm.em.findOne(User, { email: email })
        
        if (!user) {
            res.status(400).send('Bad parameters')
            return
        }

        req.session.regenerate(err => {
            if (err) next(err)
    
            req.session.user = user.name
    
            req.session.save(err => {
                if (err) return next(err)
                res.redirect('/')
            })
        })

        return
    } catch(err) {
        console.log(err)
        res.status(400).send('Bad parameters')
        return
    }
}

export default userOtacLoginHandler
