import { Router, Request, Response } from "express";
import { PrismaClient } from "../database/generated-prisma-client";
import { classRoutes } from "./class";
import { authMiddleware } from "@libs/shared";

export const apiRoutes = (prisma: PrismaClient) => {
    const router = Router();

    router.get("/", (req: Request, res: Response) => {
        res.status(200).json({ message: "This is User service!" });
    });

    router.use(authMiddleware(prisma, process.env.JWT_SECRET));
    router.use(classRoutes(prisma))

    return router;
};
