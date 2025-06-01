"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidBody = void 0;
class IsValidBody {
    static execute(schemas) {
        return async (req, res, next) => {
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            next();
        };
    }
}
exports.IsValidBody = IsValidBody;
