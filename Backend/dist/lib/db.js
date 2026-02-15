"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
exports.disconnectDb = disconnectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || '';
async function connectDb() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment');
    }
    await mongoose_1.default.connect(MONGODB_URI);
}
async function disconnectDb() {
    await mongoose_1.default.disconnect();
}
