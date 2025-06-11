"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = verifyRole;
function verifyRole(requiredRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            res.status(403).json({ message: "Access denied: no role found" });
            return;
        }
        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied: insufficient permissions" });
            return;
        }
        next();
    };
}
