"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_validator_1 = require("express-validator");
const errors_1 = require("./errors");
const errorHandler = (err, req, res, next) => {
    if (typeof err === 'string' && Object.keys(errors_1.E).includes(err)) {
        console.log('into errorHandlerMiddleware');
        console.log(err);
        switch (err) {
            case errors_1.E[errors_1.E['email in use']]:
                return res.status(400)
                    .json([{ field: 'email', message: 'The email is in use.' }]);
            case errors_1.E[errors_1.E['email not exist']]:
                return res.status(400)
                    .json([{ field: 'email', message: 'User with this email has not been signed.' }]);
            case errors_1.E[errors_1.E['password incorrect']]:
                return res.status(400)
                    .json([{ field: 'password', message: 'Password Incorrect' }]);
            case errors_1.E[errors_1.E['Journey title required']]:
                return res.status(400)
                    .json([{ field: 'title', message: 'Journey title required' }]);
            case errors_1.E[errors_1.E['scope not specified']]:
                return res.status(400)
                    .json([{ field: 'query', message: 'scope not specified' }]);
            case errors_1.E[errors_1.E['journeyId param not provided']]:
                return res.status(400)
                    .json([{ field: 'journeyId', message: 'journeyId not provided in query or body' }]);
            case errors_1.E[errors_1.E['express-validator errors']]:
                const result = (0, express_validator_1.validationResult)(req).array().map((e) => {
                    return { field: `${e.location}.${e.path}`, message: e.msg };
                });
                return res.status(400).json(result);
            case errors_1.E[errors_1.E['not all users in the journey']]:
                return res.status(400)
                    .json([{ field: 'expenses.userId', message: 'not all users are in the journey' }]);
            case errors_1.E[errors_1.E['#401']]:
                return res.status(401)
                    .json([{ field: 'user or journey', message: 'unauthorized' }]);
            case errors_1.E[errors_1.E['#404']]:
                return res.status(404)
                    .json([{ field: 'route', message: 'the route is undefined' }]);
        }
    }
    else {
        console.log(err);
        res.status(500).json([{ field: 'unspecific', message: 'uncatched errors happened' }]);
    }
};
exports.errorHandler = errorHandler;
