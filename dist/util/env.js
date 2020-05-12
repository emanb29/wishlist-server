"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("process");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = process_1.env;
