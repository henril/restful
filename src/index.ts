import dotenv from 'dotenv';
import express, { Express } from 'express';
import {createHash} from 'crypto';
import fs from 'fs';
import expressSession from 'express-session';

dotenv.config();

const app : Express = express();

app.use(express.urlencoded({extended: true}));

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!
}));

declare module 'express-session' {
    interface SessionData {
        user: string;
    }
}

function isAuthenticated (req : Express.Request, _ : any, next : any) {
    if (req.session.user) next();
    else next('route')
}

app.get('/', isAuthenticated, (req, res) => {
    res.send('<div>' +
             `Logged in as ${req.session.user}` +
             '<br/><br/><a href="/logout">Log out</a>' +
             '</div>'
    );
});

app.get('/', (req, res) => {
    res.send('<form action="/login" method="post">' +
             'Username: <input name="user"><br>' +
             'Password: <input name="password" type="password"><br>' +
             '<input type="submit" text="Login"></form>')
});

const isLoginValid = (username : string, password : string) => {
    try {
        const data = fs.readFileSync('./data/users.json', 'utf8');
        const user = JSON.parse(data)[username];
        const salted = user.salt + password;
        const hash = createHash('sha256').update(salted).digest('base64');

        return hash === user.hash;
    } catch (err) {
        console.log(err);
        return false;
    }
}

app.post('/login', (req, res, next) => {
    if (!req.body?.user || !req.body?.password) {
        res.sendStatus(400);
        return;
    }

    if (!isLoginValid(req.body.user, req.body.password)) {
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
});

app.get('/logout', (req, res, next) => {
    req.session.user = undefined;
    req.session.save(err => {
        if (err) next(err);
    
        req.session.regenerate(err => {
          if (err) next(err);
          res.redirect('/');
        })
    })
});

// Example specifying the port and starting the server
const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
