import { Router } from "express";
import { UserControllers } from "../controllers/user.controllers";
import { IsValidBody } from "../middleware/isValidBody.middleware";
import { createUserSchema, userLoginSchema } from "../schemas/userSchema.schema";
import { verifyToken } from "../middleware/verifyToken.middleware";
import { verifyRole } from "../middleware/verifyRole.middleware";
import { verifyTokenFromCookie } from "../middleware/verifyTokenFromCookie.middlware";

export const userRoutes = Router()

const userControllers = new UserControllers()

userRoutes.post("/", IsValidBody.execute({ body: createUserSchema }), userControllers.createUser)

userRoutes.post("/login", IsValidBody.execute({ body: userLoginSchema }), userControllers.loginUser)

userRoutes.get("/me", verifyTokenFromCookie.execute, userControllers.getMe)

userRoutes.get("/", verifyToken.execute, verifyRole("ADMIN"), userControllers.getAllUsers)

userRoutes.put("/", verifyToken.execute, verifyRole("ADMIN"), IsValidBody.execute({ body: createUserSchema }), userControllers.updateUser)
