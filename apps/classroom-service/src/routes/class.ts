import { Router } from "express";
import { ClassController } from "../controllers/class";
import { ClassService } from "../services/class";
import { PrismaClient } from "../database/generated-prisma-client";
import { validate } from "@libs/shared";
import {
    classAddUserRequestValidator,
    classCreateRequestValidator,
    classUpdateRequestValidator
} from "../validators/class";

export const classRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const classService = new ClassService(prisma);
    const classController = new ClassController(classService);

    router.post('/', validate(classCreateRequestValidator), classController.create.bind(classController));
    router.put('/:id', validate(classUpdateRequestValidator), classController.update.bind(classController));
    router.delete('/:id', classController.delete.bind(classController));
    router.get('/:id', classController.findById.bind(classController));
    router.get('/:id/users', classController.listUsers.bind(classController));
    router.delete('/:id/users/:user_id', classController.deleteUser.bind(classController));
    router.post('/:class_code/users', validate(classAddUserRequestValidator), classController.addUser.bind(classController));

    return router;
}