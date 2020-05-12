"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("../util/uuid");
var sparkson_1 = require("sparkson");
var listitem_1 = __importDefault(require("./listitem"));
var serialization_1 = require("../util/serialization");
var Wishlist = (function () {
    function Wishlist(id, name, shortname, description, owner, imageUrl, items) {
        this.id = id;
        this.name = name;
        this.shortname = shortname;
        this.description = description;
        this.owner = owner;
        this.imageUrl = imageUrl;
        this.items = items;
    }
    Wishlist.prototype.toString = function () {
        return "Wishlist(" + JSON.stringify(this) + ")";
    };
    Wishlist.Item = listitem_1.default;
    Wishlist = __decorate([
        __param(0, sparkson_1.Field('id')), __param(0, sparkson_1.Regexp(uuid_1.anyUUIDRegex)),
        __param(1, sparkson_1.Field('name')),
        __param(2, sparkson_1.Field('shortname')),
        __param(3, sparkson_1.Field('description', true, undefined, null)),
        __param(4, sparkson_1.Field('owner')),
        __param(5, sparkson_1.Field('imageUrl', true, undefined, null)),
        __param(6, sparkson_1.ArrayField('items', listitem_1.default)),
        __metadata("design:paramtypes", [String, String, String, serialization_1.NullableString, String, serialization_1.NullableUrl,
            Array])
    ], Wishlist);
    return Wishlist;
}());
exports.Wishlist = Wishlist;
exports.default = Wishlist;
