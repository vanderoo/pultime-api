import { PrismaClient } from "./generated-prisma-client";
import { logger } from "@libs/shared";

export const prismaClient = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

prismaClient.$on('error', (e) => {
    logger.error(e);
});
prismaClient.$on('warn', (e) => {
    logger.warn(e);
});
prismaClient.$on('query', (e) => {
    logger.info(`query: ${e.query} - params: ${e.params} - duration: ${e.duration} ms`);
});
prismaClient.$on('info', (e) => {
    logger.info(e);
});
