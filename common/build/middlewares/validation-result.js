"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = validation;
const express_validator_1 = require("express-validator");
function validation(req, res, next) {
    if (!(0, express_validator_1.validationResult)(req).isEmpty()) {
        console.log((0, express_validator_1.validationResult)(req));
        throw 'express-validator errors';
    }
    return next();
}
