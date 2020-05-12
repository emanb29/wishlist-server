"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = __importStar(require("uuid"));
exports.v1regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
exports.v3regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
exports.v4regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
exports.v5regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
exports.anyUUIDRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[1345][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
exports.containsAnyUUIDRegex = /[0-9A-F]{8}-[0-9A-F]{4}-[1345][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i;
function parseUUID(uuid) {
    if (exports.v1regex.test(uuid))
        return uuid;
    else if (exports.v3regex.test(uuid))
        return uuid;
    else if (exports.v4regex.test(uuid))
        return uuid;
    else if (exports.v5regex.test(uuid))
        return uuid;
    else
        return null;
}
exports.parseUUID = parseUUID;
exports.default = uuid;
