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
Object.defineProperty(exports, "__esModule", { value: true });
var sparkson_1 = require("sparkson");
var uuid_1 = require("../util/uuid");
var serialization_1 = require("../util/serialization");
var ListItem = (function () {
    function ListItem(id, name, description, url, imageUrl, reservedBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.imageUrl = imageUrl;
        this.reservedBy = reservedBy;
    }
    ListItem.prototype.toString = function () {
        return "Item(" + JSON.stringify(this) + ")";
    };
    ListItem = __decorate([
        __param(0, sparkson_1.Field('id')), __param(0, sparkson_1.Regexp(uuid_1.anyUUIDRegex)),
        __param(1, sparkson_1.Field('name')),
        __param(2, sparkson_1.Field('description', true, undefined, null)),
        __param(3, sparkson_1.Field('url', true, undefined, null)),
        __param(4, sparkson_1.Field('imageUrl', true, undefined, null)),
        __param(5, sparkson_1.Field('reservedBy', true, undefined, null)),
        __metadata("design:paramtypes", [String, String, serialization_1.NullableString,
            serialization_1.NullableUrl,
            serialization_1.NullableUrl,
            serialization_1.NullableString])
    ], ListItem);
    return ListItem;
}());
exports.ListItem = ListItem;
var Reservation = (function () {
    function Reservation(reservedBy) {
        this.reservedBy = reservedBy;
    }
    Reservation = __decorate([
        __param(0, sparkson_1.Field('reservedBy', true, undefined, null)),
        __metadata("design:paramtypes", [serialization_1.NullableString])
    ], Reservation);
    return Reservation;
}());
exports.Reservation = Reservation;
exports.default = ListItem;
