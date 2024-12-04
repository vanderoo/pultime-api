import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, Prisma } from '../src/database/generated-prisma-client';
import supertest from 'supertest';
import express, { Express } from 'express';
import { Server } from '../src/Server';

let server: Server;
let app: Express;

const prisma = mockDeep<PrismaClient>();
const mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;

type ClassWithCourses = Prisma.ClassGetPayload<{
    include: { courses: true };
}>;

type ClassWithUsers = Prisma.ClassGetPayload<{
    include: { users: true };
}>;

describe('ClassService Integration Testing with Prisma Mock', () => {
    beforeAll(async () => {
        server = new Server(express(), 3000, mockPrisma);
        await server.start();
        app = server.getApp();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /class', () => {
        it('Should create a new class successfully if courses are provided', async () => {
            mockPrisma.class.create.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: [
                    {
                        id: 'c1',
                        courseName: 'Algebra',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            } as unknown as ClassWithCourses);

            const response = await supertest(app)
                .post('/class')
                .send({
                    class_name: 'Math 101',
                    courses: [
                        {
                            course_name: 'Algebra',
                        },
                    ],
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('id', '1');
            expect(response.body.data.courses).toHaveLength(1);
        });

        it('Should reject if no courses are provided', async () => {
            const response = await supertest(app)
                .post('/class')
                .send({
                    class_name: 'Math 101',
                    courses: [],
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty('message', 'At least one course is required');
        });
    });

    describe('PUT /class/:id', () => {
        it('Should update class successfully if it exists', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: [],
            } as unknown as ClassWithCourses);

            mockPrisma.class.update.mockResolvedValue({
                id: '1',
                className: 'Physics 101',
                classCode: 'PHYS101',
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: [],
            } as unknown as ClassWithCourses);

            const response = await supertest(app)
                .put('/class/1')
                .send({
                    class_name: 'Physics 101',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('class_name', 'Physics 101');
        });

        it('Should reject update if class does not exist', async () => {
            mockPrisma.class.findUnique.mockResolvedValue(null);
            const id = 1;
            const response = await supertest(app)
                .put(`/class/${id}`)
                .send({
                    class_name: 'Physics 101',
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', `Class with id ${id} not found`);
        });
    });

    describe('DELETE /class/:id', () => {
        it('Should delete class successfully if it exists', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: [],
            } as unknown as ClassWithCourses);

            mockPrisma.class.delete.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app).delete('/class/1');

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('message', 'Class successfully deleted');
        });

        it('Should reject delete if class does not exist', async () => {
            mockPrisma.class.findUnique.mockResolvedValue(null);
            const id = 1
            const response = await supertest(app).delete(`/class/${id}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', `Class with id ${id} not found`);
        });
    });

    describe('GET /class/:id', () => {
        it('Should retrieve class by ID', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: [],
            } as unknown as ClassWithCourses);

            const response = await supertest(app).get('/class/1');

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('class_name', 'Math 101');
        });
    });

    describe('GET /class/:id/users', () => {
        it('Should list users in the class', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [
                    {
                        id: '1',
                        email: 'user1@example.com',
                        username: 'user1',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            } as unknown as ClassWithUsers);

            const response = await supertest(app).get('/class/1/users');

            expect(response.statusCode).toBe(200);
            expect(response.body.data[0]).toHaveProperty('email', 'user1@example.com');
        });
    });

    describe('DELETE /class/:id/users/:id', () => {
        it('Should delete a user from the class if both exist and user is in the class', async () => {
            mockPrisma.class.findUnique
                .mockResolvedValueOnce({
                    id: '1',
                    className: 'Math 101',
                    classCode: 'MATH101',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    users: [
                        {
                            id: '2',
                            email: 'user2@example.com',
                            username: 'user2',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    ],
                } as unknown as ClassWithUsers)
                .mockResolvedValueOnce(null);

            mockPrisma.user.findUnique.mockResolvedValueOnce({
                id: '2',
                email: 'user2@example.com',
                username: 'user2',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockPrisma.class.update.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [],
            } as unknown as ClassWithUsers);

            const response = await supertest(app).delete('/class/1/users/2');

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(response.body.data).toHaveLength(0); // No users left in the class
        });

        it('Should reject if the class does not exist', async () => {
            mockPrisma.class.findUnique.mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const response = await supertest(app).delete('/class/1/users/2');

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', 'Class with id 1 not found');
        });

        it('Should reject if the user does not exist', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [],
            } as unknown as ClassWithUsers);

            mockPrisma.user.findUnique.mockResolvedValue(null);

            const response = await supertest(app).delete('/class/1/users/2');

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', 'User with id 2 not found');
        });

        it('Should reject if the user is not in the class', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [],
            } as unknown as ClassWithUsers);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: '2',
                email: 'user2@example.com',
                username: 'user2',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app).delete('/class/1/users/2');

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', 'User not found in this class');
        });
    });

    describe('POST /class/:class_code/users', () => {
        const user_id = '2aea98a8-6184-4fe9-a83c-89fc7f72a8a0';
        it('Should add a user to the class successfully', async () => {
            mockPrisma.class.findUnique
                .mockResolvedValueOnce({
                    id: '1',
                    className: 'Math 101',
                    classCode: 'MATH101',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    users: [],
                } as unknown as ClassWithUsers)
                .mockResolvedValueOnce(null);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: user_id,
                email: 'user3@example.com',
                username: 'user3',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockPrisma.class.update.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [
                    {
                        id: user_id,
                        email: 'user3@example.com',
                        username: 'user3',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            } as unknown as ClassWithUsers);

            const response = await supertest(app)
                .post('/class/MATH101/users')
                .send({
                    user_id: user_id,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0]).toHaveProperty('email', 'user3@example.com');
            expect(response.body.data[0]).toHaveProperty('username', 'user3');
        });

        it('Should reject if class does not exist', async () => {
            mockPrisma.class.findUnique.mockResolvedValue(null);

            const response = await supertest(app)
                .post('/class/MATH101/users')
                .send({
                    user_id: user_id,
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', 'Class with code MATH101 not found');
        });

        it('Should reject if user does not exist', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [],
            } as unknown as ClassWithUsers);

            mockPrisma.user.findUnique.mockResolvedValue(null);

            const response = await supertest(app)
                .post('/class/MATH101/users')
                .send({
                    user_id: user_id,
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty('message', `User with id ${user_id} not found`);
        });

        it('Should reject if user already exists in the class', async () => {
            mockPrisma.class.findUnique.mockResolvedValue({
                id: '1',
                className: 'Math 101',
                classCode: 'MATH101',
                createdAt: new Date(),
                updatedAt: new Date(),
                users: [
                    {
                        id: user_id,
                        email: 'user3@example.com',
                        username: 'user3',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            } as unknown as ClassWithUsers);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: user_id,
                email: 'user3@example.com',
                username: 'user3',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app)
                .post('/class/MATH101/users')
                .send({
                    user_id: user_id,
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty('message', 'User is already a member of this class');
        });
    });
});
