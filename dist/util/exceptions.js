"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
var BaseException = (function () {
    function BaseException(message) {
        this.__isWishlistException__ = null;
        this.message = message;
    }
    return BaseException;
}());
var NoWishlistFound = (function (_super) {
    __extends(NoWishlistFound, _super);
    function NoWishlistFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoWishlistFound;
}(BaseException));
exports.NoWishlistFound = NoWishlistFound;
var NoItemFound = (function (_super) {
    __extends(NoItemFound, _super);
    function NoItemFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoItemFound;
}(BaseException));
exports.NoItemFound = NoItemFound;
var NonUniqueWishlistId = (function (_super) {
    __extends(NonUniqueWishlistId, _super);
    function NonUniqueWishlistId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NonUniqueWishlistId;
}(BaseException));
exports.NonUniqueWishlistId = NonUniqueWishlistId;
var UpdateFailed = (function (_super) {
    __extends(UpdateFailed, _super);
    function UpdateFailed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateFailed;
}(BaseException));
exports.UpdateFailed = UpdateFailed;
var ConflictingWishlistFound = (function (_super) {
    __extends(ConflictingWishlistFound, _super);
    function ConflictingWishlistFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ConflictingWishlistFound;
}(BaseException));
exports.ConflictingWishlistFound = ConflictingWishlistFound;
exports.Exceptions = {
    NoWishlistFound: NoWishlistFound,
    NoItemFound: NoItemFound,
    NonUniqueWishlistId: NonUniqueWishlistId,
    UpdateFailed: UpdateFailed,
    ConflictingWishlistFound: ConflictingWishlistFound,
};
exports.sanitizeExceptions = function (err, req, res, next) {
    if (err && '__isWishlistException__' in err) {
        console.warn("Suppressed error: " + JSON.stringify(err));
        return next(new http_errors_1.default.InternalServerError('An error occured while processing your request'));
    }
    else
        return next(err);
};
exports.default = exports.Exceptions;
