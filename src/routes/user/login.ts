import { NextFunction, Request, Response } from "express";
import checkCredential from "../../checkCredential.js";
import User from "../../entities/user.entity.js";
import { orm } from "../../app.js";

const isLoginValid = async (username : string, password : string) => {
    try {
        const user = await orm.em.findOne(User,
            { name: username },
            { populate: ['*'] }
        );

        if (user === null)
            throw 'No such user';

        if (user.credential === null)
            throw 'User has no credential';

        return checkCredential(password, user.credential!);
    } catch (err) {
        console.log(err);
        return false;
    }
}

const userLoginHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.user || !req.body?.password) {
        res.status(400).send('Bad parameters');
        return;
    }

    if (!await isLoginValid(req.body.user, req.body.password)) {
        res.status(401).send('Login failed');
        return;
    }

    req.session.regenerate(err => {
        if (err) next(err);

        req.session.user = req.body.user;

        req.session.save(err => {
            if (err) return next(err);
            res.redirect('/');
        });
    });
};

export default userLoginHandler;
