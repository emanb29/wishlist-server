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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_openid_connect_1 = require("express-openid-connect");
var env_1 = __importDefault(require("./util/env"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var wishlist_1 = require("./models/wishlist");
var uuid_1 = __importStar(require("./util/uuid"));
var authorization_1 = require("./util/authorization");
var http_errors_1 = __importDefault(require("http-errors"));
var datastore_1 = require("./util/datastore");
var exceptions_1 = __importStar(require("./util/exceptions"));
var sparkson_1 = require("sparkson");
var body_parser_1 = __importDefault(require("body-parser"));
var listitem_1 = require("./models/listitem");
var serialization_1 = __importDefault(require("./util/serialization"));
var PORT = parseInt(env_1.default['PORT'] || '3300');
var userOwnsList = function (user, req) {
    return req.body && req.body.owner && req.body.owner === user.sub;
};
var app = express_1.default();
var router = express_1.default.Router();
router.post('/wishlist', authorization_1.authorizeWith(), body_parser_1.default.json(), authorization_1.authorizeWith(userOwnsList), express_async_handler_1.default(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, list, savedList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = authorization_1.requestUser(req);
                try {
                    list = sparkson_1.parse(wishlist_1.Wishlist, req.body);
                }
                catch (_b) {
                    throw new http_errors_1.default.BadRequest('Invalid Wishlist');
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, datastore_1.addWishlist(list)];
            case 2:
                savedList = _a.sent();
                return [3, 4];
            case 3:
                err_1 = _a.sent();
                throw new http_errors_1.default.BadRequest(err_1.message);
            case 4:
                res.status(201);
                res.json(savedList);
                console.info(user.preferred_username + " created the list " + list.shortname);
                return [2];
        }
    });
}); }));
router.put("/wishlist/:listId(" + uuid_1.containsAnyUUIDRegex.source + ")", authorization_1.authorizeWith(), body_parser_1.default.json(), authorization_1.authorizeWith(userOwnsList), express_async_handler_1.default(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listId, list, savedList, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listId = uuid_1.parseUUID(req.params['listId']);
                if (listId === null)
                    throw new http_errors_1.default.BadRequest('The provided list ID was not a UUID');
                try {
                    list = sparkson_1.parse(wishlist_1.Wishlist, req.body);
                }
                catch (_b) {
                    throw new http_errors_1.default.BadRequest('Invalid Wishlist');
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, datastore_1.updateWishlist(listId, list)];
            case 2:
                savedList = _a.sent();
                return [3, 4];
            case 3:
                err_2 = _a.sent();
                if (err_2 instanceof exceptions_1.default.NoWishlistFound)
                    throw new http_errors_1.default.NotFound(err_2.message);
                else
                    throw err_2;
                return [3, 4];
            case 4:
                res.json(savedList);
                return [2];
        }
    });
}); }));
router.put("/wishlist/:listId(" + uuid_1.containsAnyUUIDRegex.source + ")/:itemId(" + uuid_1.containsAnyUUIDRegex.source + ")/reservation", body_parser_1.default.json(), express_async_handler_1.default(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listId, itemId, newReservation, savedList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listId = uuid_1.parseUUID(req.params['listId']);
                itemId = uuid_1.parseUUID(req.params['itemId']);
                if (listId === null)
                    throw new http_errors_1.default.BadRequest('The provided list ID was not a UUID');
                if (itemId === null)
                    throw new http_errors_1.default.BadRequest('The provided item ID was not a UUID');
                try {
                    newReservation = sparkson_1.parse(listitem_1.Reservation, req.body);
                }
                catch (_b) {
                    throw new http_errors_1.default.BadRequest('Invalid Reservation');
                }
                return [4, datastore_1.updateReservation(listId, itemId, newReservation.reservedBy)];
            case 1:
                savedList = _a.sent();
                res.json(savedList);
                return [2];
        }
    });
}); }));
router.get("/wishlist/:listId(" + uuid_1.containsAnyUUIDRegex.source + ")", express_async_handler_1.default(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listId, wishlist, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listId = uuid_1.parseUUID(req.params['listId']);
                if (listId === null)
                    throw new http_errors_1.default.BadRequest('The provided list ID was not a UUID');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, datastore_1.getWishlistById(listId)];
            case 2:
                wishlist = _a.sent();
                return [3, 4];
            case 3:
                err_3 = _a.sent();
                if (err_3 instanceof exceptions_1.default.NoWishlistFound)
                    throw new http_errors_1.default.NotFound(err_3.message);
                else
                    throw err_3;
                return [3, 4];
            case 4:
                res.json(wishlist);
                return [2];
        }
    });
}); }));
router.get('/wishlist/at/:shortname', express_async_handler_1.default(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var wlName, wishlist, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wlName = req.params['shortname'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, datastore_1.getWishlistByShortname(wlName)];
            case 2:
                wishlist = _a.sent();
                return [3, 4];
            case 3:
                err_4 = _a.sent();
                if (err_4 instanceof exceptions_1.default.NoWishlistFound)
                    throw new http_errors_1.default.NotFound(err_4.message);
                else
                    throw err_4;
                return [3, 4];
            case 4:
                res.json(wishlist);
                return [2];
        }
    });
}); }));
router.get('/wishlist/by/:sub', express_async_handler_1.default(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ownerSub, wishlist, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ownerSub = req.params['sub'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, datastore_1.getWishlistByUser(ownerSub)];
            case 2:
                wishlist = _a.sent();
                return [3, 4];
            case 3:
                err_5 = _a.sent();
                if (err_5 instanceof exceptions_1.default.NoWishlistFound)
                    throw new http_errors_1.default.NotFound(err_5.message);
                else
                    throw err_5;
                return [3, 4];
            case 4:
                res.json(wishlist);
                return [2];
        }
    });
}); }));
router.get('/', function (_, res) {
    res.send('Got it!');
});
router.get('/2', authorization_1.authorizeWith(), function (req, res) {
    res.json(new wishlist_1.Wishlist(uuid_1.default.v4(), 'My test list', 'test', 'A list of stuff to test with', authorization_1.requestUser(req).sub, null, [
        new listitem_1.ListItem(uuid_1.default.v4(), 'A thing I want', null, new URL('https://google.com/'), null, 'Jefff'),
        new listitem_1.ListItem(uuid_1.default.v4(), 'Another thing I want', 'This one has a description', new URL('https://yahoo.com/'), null, 'Jefff2'),
        new listitem_1.ListItem(uuid_1.default.v4(), 'Third thing', 'also described here', new URL('https://bing.com/'), null, 'Jefff3'),
    ]));
});
router.get('/3', function (req, res) {
    var _a;
    res.json(new wishlist_1.Wishlist(uuid_1.default.v4(), 'test', 'test', null, ((_a = authorization_1.requestUser(req)) === null || _a === void 0 ? void 0 : _a.sub) || 'admin', null, []));
});
router.get('/authtest', authorization_1.authorizeWith(), function (req, res) {
    var user = authorization_1.requestUser(req);
    res.json(user);
});
if (env_1.default['OAUTH_SECRET'] && env_1.default['FIRESTORE_COLLECTION'] && env_1.default['FRONTEND_URL']) {
    serialization_1.default();
    app.use(authorization_1.allowCORSFrom(env_1.default['FRONTEND_URL']));
    app.use(authorization_1.auth0Middleware);
    app.use(router);
    app.use(express_openid_connect_1.unauthorizedHandler());
    app.use(exceptions_1.sanitizeExceptions);
}
else {
    console.info('env+.env did not contain required variables.');
}
exports.wishlist = app;
exports.default = app;
