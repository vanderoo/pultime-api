import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const apiRoutes = (prisma: PrismaClient) => {
    const router = Router();
    
    router.get("/", (req: Request, res: Response) => {
        res.status(200).json({ message: "This is Task service!" });
    });
    
    return router;
};
