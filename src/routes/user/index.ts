import { Router } from "express";
import userLoginHandler from "./login.js";
import userLogoutHandler from "./logout.js";
import userCreateHandler from "./create.js";

const userRouter = Router();

userRouter.post('/login', userLoginHandler);
userRouter.get('/logout', userLogoutHandler);
userRouter.get('/create', userCreateHandler);

export default userRouter;
