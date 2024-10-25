import { NextFunction, Request, Response } from "express";

const userLogoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = void 0;
    
    req.session.save(err => {
        if (err) next(err);
    
        req.session.regenerate(err => {
          if (err) next(err);
          res.redirect('/');
        })
    })
};

export default userLogoutHandler;
