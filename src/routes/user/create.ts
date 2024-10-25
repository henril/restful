import { NextFunction, Request, Response } from "express";
import { orm } from "../../app.js";
import User from "../../entities/user.entity.js";
import Credential from "../../entities/credential.entity.js";

const userCreateHandler = async (req: Request, res: Response, next: NextFunction) => {
    const username = process.env.TESTUSER_NAME!;
    const password = process.env.TESTUSER_PASSWORD!;

    if (!username || !password)
    {
        res.status(500).send('Test user is not defined')
        return;
    }

    const existing = await orm.em.findOne(User, {name: username});

    if (existing !== null) {
        res.status(409).send('User exists');
        return;
    }

    const user = new User(username, new Credential(password));

    orm.em.persist(user);

    try {
        await orm.em.flush();
        res.sendStatus(201);
    } catch(err) {
        console.error(err)
        res.status(500).send('Failed to save user');
    }
};

export default userCreateHandler;
