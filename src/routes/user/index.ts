import { Router } from "express";
import userLoginHandler from "./login.js";
import userLogoutHandler from "./logout.js";
import userCreateHandler from "./create.js";
import userOtacSendHandler from "./otacSend.js";
import userOtacLoginHandler from "./otacLogin.js";

const userRouter = Router();

userRouter.post('/login', userLoginHandler)
          .get('/logout', userLogoutHandler)
          .get('/create', userCreateHandler)
          .get('/otac/login', userOtacLoginHandler)
          .post('/otac/send', userOtacSendHandler)

export default userRouter;
