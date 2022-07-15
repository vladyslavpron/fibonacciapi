"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
async function fibonacci(x) {
    if (x <= 1)
        return BigInt(1);
    const memoized = await controller_1.redisClient.hGetAll(`fibonacci:${x}`);
    if (Object.keys(memoized).length) {
        return BigInt(memoized[x]);
    }
    else {
        await controller_1.redisClient.hSet(`fibonacci:${x}`, x, (await fibonacci(x - 1)) + (await fibonacci(x - 2)) + "");
    }
    return (await fibonacci(x - 1)) + (await fibonacci(x - 2));
}
exports.default = fibonacci;
