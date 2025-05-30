"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const user_services_1 = require("../services/user.services");
const tsyringe_1 = require("tsyringe");
class UserControllers {
    async createUser(req, res) {
        const userService = tsyringe_1.container.resolve(user_services_1.UserServices);
        const response = await userService.createUser(req.body);
        res.status(201).json(response);
    }
    async loginUser(req, res) {
        const userService = tsyringe_1.container.resolve(user_services_1.UserServices);
        const response = await userService.loginUser(req.body);
        res.status(200).json(response);
    }
    async getUser(req, res) {
        const userService = tsyringe_1.container.resolve(user_services_1.UserServices);
        const userId = res.locals.decode?.id;
        const user = await userService.getUser(userId);
        res.status(200).json(user);
    }
    async getAllUsers(req, res) {
        const userService = tsyringe_1.container.resolve(user_services_1.UserServices);
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }
    async updateUser(req, res) {
        const userService = tsyringe_1.container.resolve(user_services_1.UserServices);
        const userId = res.locals.decode?.id;
        const data = req.body;
        const user = await userService.updateUser(userId, data);
        res.status(200).json(user);
    }
}
exports.UserControllers = UserControllers;
