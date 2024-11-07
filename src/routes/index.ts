import { Express, NextFunction, RequestHandler, Request, Response } from 'express';
import userRouter from './user/index.js';
import errorHandled from './errorHandled.js'

const addRoutes = (app: Express) => {
    function isAuthenticated (req : Express.Request, _ : any, next : any) {
        if (req.session.user) next();
        else next('route')
    }
    
    app.get('/', isAuthenticated, errorHandled((req, res) => {
        res.send('<div>' +
                 `Logged in as ${req.session.user}` +
                 '<br/><br/><a href="/user/logout">Log out</a>' +
                 '</div>'
        );
    }));

    app.get('/', errorHandled((req, res) => {
        res.send('<form action="/user/login" method="post">' +
                 'Username: <input name="user"><br>' +
                 'Password: <input name="password" type="password"><br>' +
                 '<input type="submit" text="Login"></form>' +
                 '<br/><br/>' +
                 '<form action="/user/password/sendToken" method="post">' +
                 'Email: <input name="email"><br>' +
                 '<input type="submit" value="Change password"></form>' +
                 '<br/><br/>' +
                 '<form action="/user/otac/send" method="post">' +
                 'Email address: <input name="email"><br>' +
                 '<input type="submit" text="Send login link"></form>'
                );
    }));

    app.use('/user', userRouter);
}

export default addRoutes;
