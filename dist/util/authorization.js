"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_openid_connect_1 = require("express-openid-connect");
var http_errors_1 = __importDefault(require("http-errors"));
var env_1 = __importDefault(require("./env"));
function allowCORSFrom(domain) {
    return function (req, res, next) {
        if (req.get('Referer') && !req.get('Referer').includes(domain)) {
            return next();
        }
        res.set('Access-Control-Allow-Origin', domain);
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Headers', 'Authorization');
        return next();
    };
}
exports.allowCORSFrom = allowCORSFrom;
var getUserClaimsUnsafe = require('express-openid-connect/lib/hooks/getUser');
var getUserClaims = getUserClaimsUnsafe;
function authorizeWith(authz) {
    if (authz === void 0) { authz = null; }
    var authorizer = authz || (function (_1, _2) { return true; });
    return function (rawReq, _, next) {
        var req = rawReq;
        if (req === null) {
            return next(new http_errors_1.default.Unauthorized('Authentication is required for this resource.'));
        }
        var userUnsafe = req.openid.user;
        if (!userUnsafe || !userUnsafe) {
            return next(new http_errors_1.default.Unauthorized('Authentication is required for this resource.'));
        }
        var user = userUnsafe;
        if (!authorizer(user, req)) {
            return next(new http_errors_1.default.Forbidden('You are not authorized for this resource.'));
        }
        else {
            return next();
        }
    };
}
exports.authorizeWith = authorizeWith;
function requestUser(req) {
    try {
        return req.openid.user;
    }
    catch (_a) {
        return null;
    }
}
exports.requestUser = requestUser;
exports.auth0Middleware = express_openid_connect_1.auth({
    required: false,
    errorOnRequiredAuth: false,
    auth0Logout: true,
    appSession: {
        secret: env_1.default['OAUTH_SECRET'],
    },
    getUser: function (req, config) {
        var maybeUser = getUserClaims(req, config);
        if (maybeUser) {
            var user = maybeUser;
            if (user) {
                user.preferred_username =
                    user.preferred_username ||
                        user.nickname ||
                        user.given_name ||
                        user.name ||
                        user.email;
                return user;
            }
            else
                return user;
        }
        else
            return undefined;
    },
    baseURL: env_1.default['API_URL'],
    clientID: 'leqCRd11z1BGFUIYzTX71d8L6wbPjzJ4',
    issuerBaseURL: 'https://wishlist-app.auth0.com',
});
