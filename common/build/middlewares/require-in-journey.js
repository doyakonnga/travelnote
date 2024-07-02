"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireInJourney = requireInJourney;
require("./req-user");
const errors_1 = require("./errors");
function requireInJourney(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.journeyIds))
            throw errors_1.E[errors_1.E['#401']];
        let journeyId = '';
        if (typeof ((_b = req.query) === null || _b === void 0 ? void 0 : _b.journeyId) === 'string') {
            journeyId = req.query.journeyId;
        }
        else if (typeof ((_c = req.body) === null || _c === void 0 ? void 0 : _c.journeyId) === 'string') {
            journeyId = req.body.journeyId;
        }
        else {
            throw errors_1.E[errors_1.E['journeyId param not provided']];
        }
        if (!((_d = req.user.journeyIds) === null || _d === void 0 ? void 0 : _d.includes(journeyId)))
            throw errors_1.E[errors_1.E['#401']];
        else {
            return next();
        }
    });
}
