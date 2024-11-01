import { Router } from "express";
import userLoginHandler from "./login.js";
import userLogoutHandler from "./logout.js";
import userCreateHandler from "./create.js";
import userOtacSendHandler from "./otacSend.js";
import userOtacLoginHandler from "./otacLogin.js";
import userPasswordFormHandler from "./passwordForm.js";
import userPasswordSetHandler from "./passwordSet.js";
import userPasswordSendTokenHandler from "./passwordSendToken.js";

const userRouter = Router();

userRouter.post('/login', userLoginHandler)
          .get('/logout', userLogoutHandler)
          .get('/create', userCreateHandler)
          .get('/otac/login', userOtacLoginHandler)
          .post('/otac/send', userOtacSendHandler)
          .get('/password/form', userPasswordFormHandler)
          .post('/password/sendToken', userPasswordSendTokenHandler)
          .post('/password/set', userPasswordSetHandler)

export default userRouter;
