import {
    UpdateUserRequest,
    UserClassesResponse,
    UserResponse,
    UserTeamsResponse
} from "../models/user";
import { User } from "../database/generated-prisma-client";

export interface IUserService {
    updateUsername(user: User, request: UpdateUserRequest): Promise<UserResponse>;
    get(user: User): Promise<UserResponse>;
    listUserClasses(user: User): Promise<UserClassesResponse[]>;
    listUserTeams(user: User): Promise<UserTeamsResponse[]>;
}