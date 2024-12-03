import 'dotenv/config';
import express from 'express';
import { Server } from './src/Server';
import { prismaClient } from "./src/database/prisma-client";

const app = express();
const port = Number(process.env.PORT) || 3000;
const server = new Server(app, port, prismaClient);

server.start();