import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {userRoutes} from "./user";

export const apiRoutes = (prisma: PrismaClient) => {
    const router = Router();
    
    router.get("/", (req: Request, res: Response) => {
        res.status(200).json({ message: "This is User service!" });
    });

    router.use(userRoutes(prisma))

    return router;
};
