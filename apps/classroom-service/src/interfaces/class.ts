import {
    ClassAddUserRequest,
    ClassRequest,
    ClassResponse,
    ClassUpdateRequest,
    ClassUsersResponse,
} from "../models/class";

export interface IClassService {
    create(request: ClassRequest): Promise<ClassResponse>;
    update(request: ClassUpdateRequest): Promise<ClassResponse>;
    delete(classId: string): Promise<Record<string, any>>;
    findById(classId: string): Promise<ClassResponse>;
    listUsers(classId: string): Promise<ClassUsersResponse[]>;
    deleteUser(classId: string, userId: string): Promise<ClassUsersResponse[]>;
    addUser(request: ClassAddUserRequest): Promise<ClassUsersResponse[]>;
}
