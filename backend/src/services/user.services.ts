import { prisma } from "../database/prisma";
import { IUser, IUserLogin } from "../interface/user.interface";
import { injectable } from "tsyringe";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@injectable()
export class UserServices {
  async createUser(body: IUser) {
    const existingUser = await prisma.user.findUnique({
      where: { login: body.login ?? undefined },
    });

    if (existingUser) {
      throw new Error("Username already registered");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    if (!body.login) {
      throw new Error("Username is required");
    }
    const newUser = await prisma.user.create({
      data: {
        login: body.login,
        password: hashedPassword,
        role: body.role ?? "USER",
      },
    });

    return { ...newUser, password: undefined };
  }

  async loginUser(body: IUserLogin) {
    const user = await prisma.user.findUnique({
      where: { login: body.login },
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    const isMatch = await bcrypt.compare(body.password, user.password ?? "");

    if (!isMatch) {
      throw new Error("Username and password do not match");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "365d" }
    );

    const { password, ...userWithoutPassword } = user;
    return { accessToken: token, user: userWithoutPassword };
  }

  async getUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { ...user, password: undefined };
  }

  async getAllUsers() {
    const users = await prisma.user.findMany();

    return users.map((user) => ({
      ...user,
      password: undefined,
    }));
  }

  async updateUser(userId: number, data: Partial<IUser>) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updateData: any = {};

    if (data.login) {
      updateData.login = data.login;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.role) {
      updateData.role = data.role.toUpperCase(); // Para garantir consistência
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
