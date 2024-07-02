"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reqUser = (req, res, next) => {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt))
        return next();
    req.user = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
    return next();
};
exports.reqUser = reqUser;
