"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const fibonacci_1 = __importDefault(require("./fibonacci"));
const redis = __importStar(require("redis"));
exports.redisClient = redis.createClient({
    url: "redis://redis:6379",
});
const router = express_1.default.Router();
exports.redisClient.on("error", (err) => {
    console.log(err);
});
let tickets = 0;
(async function () {
    await exports.redisClient.connect();
    tickets = await exports.redisClient.dbSize();
})();
router.get("/output", async (req, res) => {
    try {
        const ticket = decodeURIComponent(req.query.ticket + "");
        const result = await exports.redisClient.get(req.query.ticket + "");
        if (!result) {
            return res.status(404).json({
                staus: "fail",
                message: "ticket not found",
            });
        }
        res.json({ Fibonacci: result });
    }
    catch (err) {
        res.status(500).json({ status: "fail", message: "internal server error" });
    }
});
router.post("/input", async (req, res) => {
    try {
        const ticket = tickets + 1;
        tickets++;
        if (req.body.number > 50000 || req.body.number < -50000) {
            return res.status(400).json({
                status: "fail",
                message: "number must be in between -50000 and 50000",
            });
        }
        res.json({ ticket });
        const result = await (0, fibonacci_1.default)(req.body.number);
        await exports.redisClient.set(ticket + "", result + "");
        const get = await exports.redisClient.get(ticket + "");
    }
    catch (err) {
        res.status(500).json({ status: "fail", message: "internal server error" });
    }
});
exports.default = router;
