"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salaNobreRoutes = void 0;
const express_1 = require("express");
const salanobre_controllers_1 = require("../controllers/salanobre.controllers");
const isValidBody_middleware_1 = require("../middleware/isValidBody.middleware");
const salanobre_schema_1 = require("../schemas/salanobre.schema");
const verifyToken_middleware_1 = require("../middleware/verifyToken.middleware");
const verifyRole_middleware_1 = require("../middleware/verifyRole.middleware");
exports.salaNobreRoutes = (0, express_1.Router)();
const salaNobreControllers = new salanobre_controllers_1.SalaNobreController();
exports.salaNobreRoutes.post("/", verifyToken_middleware_1.verifyToken.execute, (0, verifyRole_middleware_1.verifyRole)(["ADMIN", "NOBRE"]), isValidBody_middleware_1.IsValidBody.execute({ body: salanobre_schema_1.createCaixasSchema }), salaNobreControllers.createCaixas);
exports.salaNobreRoutes.get("/", salaNobreControllers.getCaixas);
