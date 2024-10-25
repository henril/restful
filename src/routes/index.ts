import { Express } from 'express';
import userRouter from './user/index.js';

const addRoutes = (app: Express) => {
    function isAuthenticated (req : Express.Request, _ : any, next : any) {
        if (req.session.user) next();
        else next('route')
    }
    
    app.get('/', isAuthenticated, (req, res) => {
        res.send('<div>' +
                 `Logged in as ${req.session.user}` +
                 '<br/><br/><a href="/user/logout">Log out</a>' +
                 '</div>'
        );
    });

    app.get('/', (req, res) => {
        res.send('<form action="/user/login" method="post">' +
                 'Username: <input name="user"><br>' +
                 'Password: <input name="password" type="password"><br>' +
                 '<input type="submit" text="Login"></form>')
    });

    app.use('/user', userRouter);
}

export default addRoutes;
