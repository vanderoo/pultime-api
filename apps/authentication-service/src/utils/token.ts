import jwt, { Secret } from "jsonwebtoken";
import { jwtPayload } from "../types/jwt";

export const generateToken = async (payload: jwtPayload, secret: Secret, expiresIn: string) => {
    return jwt.sign(payload,secret,{
        expiresIn
    });
}
export const validateToken = async (token: string, secret: Secret) => {
    try {
        const decoded = jwt.verify(token, secret) as jwtPayload;
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error: error instanceof Error ? error.message : "Invalid token" };
    }
}