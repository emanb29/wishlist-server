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
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("@google-cloud/firestore");
var env_1 = __importDefault(require("./env"));
var exceptions_1 = __importDefault(require("./exceptions"));
var serialization_1 = require("./serialization");
exports.storage = new firestore_1.Firestore();
exports.collection = exports.storage.collection(env_1.default['FIRESTORE_COLLECTION']);
function getWishlistById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, wishlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exports.collection.where('id', '==', id).get()];
                case 1:
                    docs = (_a.sent()).docs;
                    if (docs.length === 0) {
                        throw new exceptions_1.default.NoWishlistFound("No wishlist exists with the provided ID");
                    }
                    else if (docs.length > 1) {
                        throw new exceptions_1.default.NonUniqueWishlistId("Multiple wishlists matched the provided ID");
                    }
                    wishlist = docs[0];
                    return [2, wishlist.data()];
            }
        });
    });
}
exports.getWishlistById = getWishlistById;
function getWishlistByUser(sub) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, wishlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exports.collection.where('owner', '==', sub).get()];
                case 1:
                    docs = (_a.sent()).docs;
                    if (docs.length === 0) {
                        throw new exceptions_1.default.NoWishlistFound("No wishlist exists by the provided user");
                    }
                    else if (docs.length > 1) {
                        throw new exceptions_1.default.NonUniqueWishlistId("Multiple wishlists were found matching the provided user");
                    }
                    wishlist = docs[0];
                    return [2, wishlist.data()];
            }
        });
    });
}
exports.getWishlistByUser = getWishlistByUser;
function getWishlistByShortname(name) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, wishlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exports.collection.where('shortname', '==', name).get()];
                case 1:
                    docs = (_a.sent()).docs;
                    if (docs.length === 0) {
                        throw new exceptions_1.default.NoWishlistFound("No wishlist exists with the provided short name");
                    }
                    else if (docs.length > 1) {
                        throw new exceptions_1.default.NonUniqueWishlistId("Multiple wishlists were found matching the provided short name");
                    }
                    wishlist = docs[0];
                    return [2, wishlist.data()];
            }
        });
    });
}
exports.getWishlistByShortname = getWishlistByShortname;
function addWishlist(list) {
    return __awaiter(this, void 0, void 0, function () {
        var noCollisions, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, exports.collection.where('shortname', '==', list.shortname).limit(1).get()];
                case 1: return [4, (_c.sent()).empty];
                case 2:
                    _b = (_c.sent());
                    if (!_b) return [3, 5];
                    return [4, exports.collection.where('id', '==', list.id).limit(1).get()];
                case 3: return [4, (_c.sent())
                        .empty];
                case 4:
                    _b = (_c.sent());
                    _c.label = 5;
                case 5:
                    _a = _b;
                    if (!_a) return [3, 8];
                    return [4, exports.collection.where('owner', '==', list.owner).limit(1).get()];
                case 6: return [4, (_c.sent())
                        .empty];
                case 7:
                    _a = (_c.sent());
                    _c.label = 8;
                case 8:
                    noCollisions = _a;
                    if (!noCollisions) return [3, 11];
                    console.debug("uploading new wishlist " + list);
                    return [4, exports.collection.add(serialization_1.untype(list))];
                case 9: return [4, (_c.sent()).get()];
                case 10: return [2, (_c.sent()).data()];
                case 11: throw new exceptions_1.default.ConflictingWishlistFound('The wishlist provided had either a duplicate shortname, owner, or id');
            }
        });
    });
}
exports.addWishlist = addWishlist;
function updateWishlist(id, newList) {
    return __awaiter(this, void 0, void 0, function () {
        var noCollisions, docs, oldList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exports.collection
                        .where('shortname', '==', newList.shortname)
                        .limit(2)
                        .get()];
                case 1: return [4, (_a.sent()).docs.every(function (doc) { return doc.data().owner === newList.owner; })];
                case 2:
                    noCollisions = _a.sent();
                    if (!noCollisions) {
                        throw new exceptions_1.default.ConflictingWishlistFound('There is already a wishlist with that shortname');
                    }
                    return [4, exports.collection
                            .where('owner', '==', newList.owner)
                            .where('id', '==', id)
                            .get()];
                case 3:
                    docs = (_a.sent()).docs;
                    if (docs.length === 0) {
                        throw new exceptions_1.default.NoWishlistFound("No wishlist exists with the provided ID");
                    }
                    else if (docs.length > 1) {
                        throw new exceptions_1.default.NonUniqueWishlistId("Multiple wishlists matched the provided ID");
                    }
                    oldList = docs[0];
                    return [4, oldList.ref.set(serialization_1.untype(newList))];
                case 4:
                    _a.sent();
                    return [2, newList];
            }
        });
    });
}
exports.updateWishlist = updateWishlist;
function updateReservation(listId, itemId, reservedBy) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, wishlist, itemIdx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, exports.collection.where('id', '==', listId).get()];
                case 1:
                    docs = (_a.sent()).docs;
                    if (docs.length === 0) {
                        throw new exceptions_1.default.NoWishlistFound("No wishlist exists with the provided ID");
                    }
                    else if (docs.length > 1) {
                        throw new exceptions_1.default.NonUniqueWishlistId("Multiple wishlists matched the provided ID");
                    }
                    wishlist = docs[0].data();
                    itemIdx = wishlist.items.findIndex(function (li) { return li.id === itemId; });
                    if (itemIdx == -1) {
                        throw new exceptions_1.default.NoItemFound("Could not find any item with ID " + itemId + " in wishlist " + listId);
                    }
                    wishlist.items[itemIdx].reservedBy = reservedBy;
                    return [2, updateWishlist(listId, wishlist)];
            }
        });
    });
}
exports.updateReservation = updateReservation;
