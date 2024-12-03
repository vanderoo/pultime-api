import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '../src/database/generated-prisma-client';
import { mockGenerateToken, mockValidateToken } from "./mocks/token"
jest.mock("../src/utils/token", () => ({
    generateToken: mockGenerateToken,
    validateToken: mockValidateToken,
}));
import supertest from "supertest";
import { Server } from "../src/Server";
import bcrypt from "bcrypt";
import express, { Express } from "express";

let server: Server;
let app: Express;

const prisma = mockDeep<PrismaClient>();
const mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("AuthService Integration Testing with Prisma Mock", () => {

    beforeAll(async () => {
        server = new Server(express(), 3000, mockPrisma);
        await server.start();
        app = server.getApp();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /auth/signup", () => {
        it("Should register a new user successfully", async () => {
            mockPrisma.user.findFirst.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue({
                id: "1",
                email: "test@example.com",
                username: "testuser",
                password: await bcrypt.hash("Test@123", 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app)
                .post("/auth/signup")
                .send({
                    email: "test@example.com",
                    username: "testuser",
                    password: "Test@123",
                    confirm_password: "Test@123",
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveProperty("id", "1");
            expect(response.body.data).toHaveProperty("username", "testuser");
        });

        it("Should reject if email is already taken", async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce({
                id: "1",
                email: "test@example.com",
                username: "testuser",
                password: await bcrypt.hash("Test@123", 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app)
                .post("/auth/signup")
                .send({
                    email: "test@example.com",
                    username: "newuser",
                    password: "Test@123",
                    confirm_password: "Test@123",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty("message", "Email is already taken");
        });

        it("Should reject if username is already taken", async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce({
                id: "1",
                email: "other@example.com",
                username: "testuser",
                password: await bcrypt.hash("Test@123", 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app)
                .post("/auth/signup")
                .send({
                    email: "newuser@example.com",
                    username: "testuser",
                    password: "Test@123",
                    confirm_password: "Test@123",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty("message", "Username is already taken");
        });

        it("Should reject if passwords do not match", async () => {
            const response = await supertest(app)
                .post("/auth/signup")
                .send({
                    email: "new@example.com",
                    username: "newuser",
                    password: "Test@123",
                    confirm_password: "WrongPassword@123",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty("message", "Passwords do not match");
        });

        it("Should reject if email format is invalid", async () => {
            const response = await supertest(app)
                .post("/auth/signup")
                .send({
                    email: "invalid-email",
                    username: "newuser",
                    password: "Test@123",
                    confirm_password: "Test@123",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty("message", "Invalid email format");
        });

        it("Should reject if password is too weak", async () => {
            const response = await supertest(app)
                .post("/auth/signup")
                .send({
                    email: "newuser@example.com",
                    username: "newuser",
                    password: "12345678",
                    confirm_password: "12345678",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty(
                "message",
                "Password must contain at least one uppercase letter, one lowercase letter, and a special character"
            );
        });
    });

    describe("POST /auth/login", () => {
        it("Should log in successfully with correct credentials", async () => {
            const hashedPassword = await bcrypt.hash("Test@123", 10);
            mockPrisma.user.findUnique.mockResolvedValue({
                id: "1",
                email: "test@example.com",
                username: "testuser",
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockPrisma.token.create.mockResolvedValue({
                id: "1",
                refreshToken: "valid-refresh-token",
                userId: "1",
                createdAt: new Date(),
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
            });

            const response = await supertest(app)
                .post("/auth/login")
                .send({
                    username: "testuser",
                    password: "Test@123",
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty("access_token");
            expect(response.body.data).toHaveProperty("refresh_token");
        });

        it("Should reject login with invalid credentials", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const response = await supertest(app)
                .post("/auth/login")
                .send({
                    username: "testuser",
                    password: "WrongPassword",
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.errors[0]).toHaveProperty("message", "Invalid username or password");
        });

        it("Should reject login if username is not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const response = await supertest(app)
                .post("/auth/login")
                .send({
                    username: "nonexistentuser",
                    password: "Test@123",
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.errors[0]).toHaveProperty("message", "Invalid username or password");
        });

        it("Should reject login if password is incorrect", async () => {
            const hashedPassword = await bcrypt.hash("Test@123", 10);
            mockPrisma.user.findUnique.mockResolvedValue({
                id: "1",
                email: "test@example.com",
                username: "testuser",
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await supertest(app)
                .post("/auth/login")
                .send({
                    username: "testuser",
                    password: "WrongPassword",
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.errors[0]).toHaveProperty("message", "Invalid username or password");
        });

        it("Should reject login if username is missing", async () => {
            const response = await supertest(app)
                .post("/auth/login")
                .send({
                    password: "Test@123",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty("path", ["username"]);
            expect(response.body.errors[0]).toHaveProperty("message", "Required");
        });

        it("Should reject login if password is missing", async () => {
            const response = await supertest(app)
                .post("/auth/login")
                .send({
                    username: "testuser",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0]).toHaveProperty("path", ["password"]);
            expect(response.body.errors[0]).toHaveProperty("message", "Required");
        });
    });

    describe("DELETE /auth/logout", () => {
        it("Should successfully log out if refresh token is valid", async () => {
            const validToken = "valid-refresh-token";
            const createdAt = new Date();
            const expiresAt = new Date(new Date().setDate(new Date().getDate() + 7));

            mockPrisma.token.findFirst.mockResolvedValue({
                id: "1",
                refreshToken: validToken,
                userId: "1",
                createdAt: createdAt,
                expiresAt: expiresAt,
            });

            mockPrisma.token.delete.mockResolvedValue({
                id: "1",
                refreshToken: validToken,
                userId: "1",
                createdAt: createdAt,
                expiresAt: expiresAt,
            });

            const response = await supertest(app)
                .delete("/auth/logout")
                .send({
                    refresh_token: validToken,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty("message", "Successfully logged out");
        });

        it("Should return 404 if refresh token is not found", async () => {
            mockPrisma.token.findFirst.mockResolvedValue(null);

            const response = await supertest(app)
                .delete("/auth/logout")
                .send({
                    refresh_token: "nonexistent-refresh-token",
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty("message", "Token Not Found");
        });
    });

    describe("POST /auth/refresh-token", () => {

        beforeEach(() => {
            jest.clearAllMocks();
            mockGenerateToken.mockReset();
            mockValidateToken.mockReset();
        });

        it("Should issue new tokens if refresh token is valid", async () => {
            const validToken = "mock-token-1";
            const newAccessToken = "mock-token-new";

            mockPrisma.token.findFirst.mockResolvedValue({
                id: "1",
                refreshToken: validToken,
                userId: "1",
                createdAt: new Date(),
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
            });

            mockValidateToken.mockReturnValueOnce({
                valid: true,
                decoded: { userId: "1", iat: Date.now() / 1000, exp: Date.now() / 1000 + 3600 },
            });
            mockGenerateToken.mockReturnValueOnce(newAccessToken);

            const response = await supertest(app)
                .post("/auth/refresh-token")
                .send({
                    refresh_token: validToken,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty("access_token", newAccessToken);
            expect(response.body.data).toHaveProperty("access_token_expires");
        });

        it("Should return 404 if refresh token is not found", async () => {
            mockPrisma.token.findFirst.mockResolvedValue(null);

            const response = await supertest(app)
                .post("/auth/refresh-token")
                .send({
                    refresh_token: "nonexistent-refresh-token",
                });

            expect(response.statusCode).toBe(404);
            expect(response.body.errors[0]).toHaveProperty("message", "Token not found");
        });

        it("Should return 401 if refresh token is invalid", async () => {
            const invalidToken = "invalid-refresh-token";

            mockPrisma.token.findFirst.mockResolvedValue({
                id: "1",
                refreshToken: invalidToken,
                userId: "1",
                createdAt: new Date(),
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
            });

            mockValidateToken.mockReturnValueOnce({ valid: false, error: "Invalid token" });

            const response = await supertest(app)
                .post("/auth/refresh-token")
                .send({
                    refresh_token: invalidToken,
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.errors[0]).toHaveProperty("message", "Invalid token");
        });
    });

});
