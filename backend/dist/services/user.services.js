"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const prisma_1 = require("../database/prisma");
const tsyringe_1 = require("tsyringe");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UserServices = class UserServices {
    async createUser(body) {
        if (!body.login) {
            throw new Error("Login is required");
        }
        if (!body.password) {
            throw new Error("Password is required");
        }
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { login: body.login ?? undefined },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(body.password, 10);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                login: body.login,
                password: hashedPassword,
                role: body.role ?? "USER",
            },
        });
        return { ...newUser, password: undefined };
    }
    async loginUser(body) {
        if (!body.login) {
            throw new Error("Login is required");
        }
        if (!body.password) {
            throw new Error("Password is required");
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { login: body.login },
        });
        if (!user) {
            throw new Error("User not exists");
        }
        const isMatch = await bcrypt_1.default.compare(body.password, user.password ?? "");
        if (!isMatch) {
            throw new Error("Invalid login or password");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "365d" });
        const { password, ...userWithoutPassword } = user;
        return { accessToken: token, user: userWithoutPassword };
    }
    async getUser(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return { ...user, password: undefined };
    }
    async getAllUsers() {
        const users = await prisma_1.prisma.user.findMany();
        return users.map((user) => ({
            ...user,
            password: undefined,
        }));
    }
    async updateUser(userId, data) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const updateData = {};
        if (data.login) {
            updateData.login = data.login;
        }
        if (data.password) {
            updateData.password = await bcrypt_1.default.hash(data.password, 10);
        }
        if (data.role) {
            updateData.role = data.role.toUpperCase(); // Para garantir consistência
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
};
exports.UserServices = UserServices;
exports.UserServices = UserServices = __decorate([
    (0, tsyringe_1.injectable)()
], UserServices);
