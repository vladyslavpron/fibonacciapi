"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const controller_1 = __importDefault(require("./controller"));
const express_1 = __importDefault(require("express"));
if (cluster_1.default.isPrimary) {
    const totalcpus = os_1.default.cpus().length;
    for (let i = 0; i < totalcpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died, forking another worker`);
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("", controller_1.default);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
}
