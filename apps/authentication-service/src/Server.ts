import cors from "cors";
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { apiRoutes } from "./routes";

export class Server {
  private app: Express;
  private prisma: PrismaClient;
  private port: number;

  constructor(app: Express, port: number) {
    this.app = app;
    this.prisma = new PrismaClient();
    this.port = port;
  }

  private async initializeDatabase() {
    try {
      await this.prisma.$connect();
      console.log("Database connected successfully.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      process.exit(1);
    }
  }

  private setupRoutes() {
    const corsOptions = {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };

    this.app.use(cors(corsOptions));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(apiRoutes(this.prisma));
  }

  public async start() {
    await this.initializeDatabase();
    this.setupRoutes();

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
