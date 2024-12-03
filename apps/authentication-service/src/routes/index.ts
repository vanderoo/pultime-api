import { Router, Request, Response } from "express";
import { authRoutes } from "./auth";
import { PrismaClient } from "../database/generated-prisma-client";

export const apiRoutes = (prisma: PrismaClient) => {
    const router = Router();
    
    router.get("/", (req: Request, res: Response) => {
        res.status(200).json({ message: "This is Auth service!" });
    });
    
    router.use(authRoutes(prisma));
    
    return router;
};
