import express, { Express } from 'express';
import expressSession from 'express-session';
import { MikroORM, PostgreSqlDriver, RequestContext } from '@mikro-orm/postgresql';
import addRoutes from './routes/index.js';

declare module 'express-session' {
    interface SessionData {
        user: string;
    }
}

export const orm = await MikroORM.init({
    driver: PostgreSqlDriver,
    entities: ['./dist/entities/**/*.entity.js'],
    entitiesTs: ['./src/entities/**/*.entity.ts'],
});

const createApp = (): Express => {
    const app : Express = express();

    app.use(express.urlencoded({extended: true}));
    
    app.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET!
    }));
   
    app.use((req, res, next) => {
        RequestContext.create(orm.em, next);
    });

    addRoutes(app);

    return app;
}

export default createApp;
