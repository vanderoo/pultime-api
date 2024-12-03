import { Router, Request, Response } from "express";
import { PrismaClient } from "../database/generated-prisma-client";
import { userRoutes } from "./user";
import { authMiddleware } from "@libs/shared";

export const apiRoutes = (prisma: PrismaClient) => {
    const router = Router();
    
    router.get("/", (req: Request, res: Response) => {
        res.status(200).json({ message: "This is User service!" });
    });

    router.use(authMiddleware(prisma, process.env.JWT_SECRET));
    router.use(userRoutes(prisma))

    return router;
};
