import { Router } from "express";
import userLoginHandler from "./login.js";
import userLogoutHandler from "./logout.js";
import userCreateHandler from "./create.js";
import userOtacSendHandler from "./otacSend.js";
import userOtacLoginHandler from "./otacLogin.js";
import userPasswordFormHandler from "./passwordForm.js";
import userPasswordSetHandler from "./passwordSet.js";
import userPasswordSendTokenHandler from "./passwordSendToken.js";
import errorHandled from "../errorHandled.js"

const userRouter = Router();

userRouter.post('/login', errorHandled(userLoginHandler))
          .get('/logout', errorHandled(userLogoutHandler))
          .get('/create', errorHandled(userCreateHandler))
          .get('/otac/login', errorHandled(userOtacLoginHandler))
          .post('/otac/send', errorHandled(userOtacSendHandler))
          .get('/password/form', errorHandled(userPasswordFormHandler))
          .post('/password/sendToken', errorHandled(userPasswordSendTokenHandler))
          .post('/password/set', errorHandled(userPasswordSetHandler))

export default userRouter;
