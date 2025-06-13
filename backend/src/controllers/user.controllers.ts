import { Request, Response } from "express";
import { UserServices } from "../services/user.services";
import { container } from "tsyringe";

export class UserControllers {
  async createUser(req: Request, res: Response) {
    const userService = container.resolve(UserServices);

    const response = await userService.createUser(req.body);

    res.status(201).json(response);
  }

  async loginUser(req: Request, res: Response) {
    const userService = container.resolve(UserServices);

    const { accessToken, user } = await userService.loginUser(req.body);

    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    console.log("Token gerado:", accessToken);

    res.status(200).json({ accessToken, user });
  }

  async getMe(req: Request, res: Response, next: unknown) {
    const userService = container.resolve(UserServices);

    const userId = res.locals.decode?.id;

    const user = userService.getUser(userId);

    res.status(200).json(user);
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const userService = container.resolve(UserServices);
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userService = container.resolve(UserServices);
    const userId = res.locals.decode?.id;
    const data = req.body;

    const user = await userService.updateUser(userId, data);

    res.status(200).json(user);
  }
}
