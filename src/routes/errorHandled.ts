import { NextFunction, Request, RequestHandler, Response } from "express"

/**
 * Wraps a RequestHandler such that any exception thrown in it
 * gets passed to the next handler in the development environment.
 * In a non-development environment, sends status 500.
 */
const errorHandled = (handler: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next)
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                next(e)
            } else {
                res.sendStatus(500)
            }
        }
    }

export default errorHandled
