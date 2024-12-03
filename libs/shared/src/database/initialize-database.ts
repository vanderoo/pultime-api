import { logger } from "../configs/logging";

export const initializeDatabase = async (
    prisma: any,
    retries = 3,
    delay = 1000
) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            logger.info(`Attempting to connect to the database (Attempt ${attempt}/${retries})...`);
            await prisma.$connect();
            logger.info("Database connected successfully.");
            return;
        } catch (error) {
            logger.warn(`Attempt ${attempt} failed. ${error.message}`);
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                logger.error("Exhausted all retry attempts. Failed to connect to the database: ");
                throw new Error(`Database connection failed after ${retries} attempts`);
            }
        }
    }
};