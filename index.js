"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var process_1 = require("process");
var app = express_1.default();
var PORT = parseInt(process_1.env['PORT'] || '3300');
app.listen(PORT, function () {
    console.log("Server is listening on " + PORT);
});
app.get('/', function (req, res) {
    res.send("Got it!");
});
exports.default = app;
