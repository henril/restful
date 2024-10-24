import dotenv from 'dotenv';
import express, { Express } from 'express';
import expressSession from 'express-session';
import User from './entities/user.entity.js';
import { MikroORM, PostgreSqlDriver, RequestContext } from '@mikro-orm/postgresql';
import Credential from './entities/credential.entity.js';
import checkCredential from './checkCredential.js';

dotenv.config();

const orm = await MikroORM.init({
    driver: PostgreSqlDriver,
    entities: ['./dist/entities/**/*.entity.js'],
    entitiesTs: ['./src/entities/**/*.entity.ts'],
});

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

app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});

orm.connect().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database:', error);    
});

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

app.get('/create', async (req, res) => {
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
});

app.get('/', (req, res) => {
    res.send('<form action="/login" method="post">' +
             'Username: <input name="user"><br>' +
             'Password: <input name="password" type="password"><br>' +
             '<input type="submit" text="Login"></form>')
});

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

        return checkCredential(password, user.credential);
    } catch (err) {
        console.log(err);
        return false;
    }
}

app.post('/login', async (req, res, next) => {
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
