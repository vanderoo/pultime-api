import cors from "cors";
import express, { Express } from "express";
import { apiRoutes } from "./routes";
import { PrismaClient } from "./database/generated-prisma-client";
import {
  errorMiddleware,
  corsOptions,
  logger,
  initializeDatabase
} from "@libs/shared";

export class Server {
  private readonly app: Express;
  private readonly prisma: PrismaClient;
  private readonly port: number;

  constructor(app: Express, port: number, prismaClient: PrismaClient) {
    this.app = app;
    this.prisma = prismaClient;
    this.port = port;

    this.handleShutdownSignals()
  }

  public getApp(){
    return this.app;
  }

  private configureApp() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(apiRoutes(this.prisma));
    this.app.use(errorMiddleware);
  }

  private handleShutdownSignals() {
    const shutdown = async (signal: string) => {
      try {
        logger.info(`${signal} received. Closing resources...`);
        await this.prisma.$disconnect();
        logger.info("Database connection closed.");
        process.exit(0);
      } catch (error) {
        logger.error(`Error during shutdown: ${error.message}`);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  }

  public async start() {
    try {
      this.configureApp();
      await initializeDatabase(this.prisma);
      this.app.listen(this.port, () => {
        logger.info(`Server is running on port ${this.port}`);
      });
    } catch (error) {
      logger.error(`Failed to start the server: ${error.message}`);
      process.exit(1);
    }
  }
}
