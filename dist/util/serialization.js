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
Object.defineProperty(exports, "__esModule", { value: true });
var sparkson_1 = require("sparkson");
function registerSerializers() {
    sparkson_1.registerStringMapper(NullableUrl, function (val) { return new URL(val); });
    sparkson_1.registerStringMapper(NullableString, function (val) { return val; });
}
exports.registerSerializers = registerSerializers;
var NullableUrl = (function (_super) {
    __extends(NullableUrl, _super);
    function NullableUrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullableUrl.type = 'NullableUrl';
    return NullableUrl;
}(URL));
exports.NullableUrl = NullableUrl;
var NullableString = (function (_super) {
    __extends(NullableString, _super);
    function NullableString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullableString.type = 'NullableString';
    return NullableString;
}(String));
exports.NullableString = NullableString;
function untype(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.untype = untype;
exports.default = registerSerializers;
