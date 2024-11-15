import 'dotenv/config';
import express from 'express';
import { Server } from './src/Server';

const app = express();
const port = Number(process.env.PORT) || 8080;
const server = new Server(app, port);

server.start();
