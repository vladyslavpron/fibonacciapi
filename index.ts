import cluster from "cluster";
import os from "os";
import fibonacci from "./fibonacci";
import router from "./controller";
import express, { Request, Response } from "express";

if (cluster.isPrimary) {
  const totalcpus = os.cpus().length;
  for (let i = 0; i < totalcpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died, forking another worker`);
    cluster.fork();
  });
} else {
  const app = express();

  app.use(express.json());
  app.use("", router);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
}
