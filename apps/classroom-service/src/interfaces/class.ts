export interface IUser {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IClass {
    id: string;
    className: string;
    classCode: string;
    courses: ICourse[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICourse {
    id: string;
    courseName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IClassService {
    create(className: string, courses: { courseName: string }[]): Promise<IClass>;
    update(id: string, className: string, courses: { courseId: string, courseName: string }[]): Promise<IClass>;
    delete(id: string): Promise<IClass>;
    findById(id: string): Promise<IClass>;
    addUser(userId: string, classCode: string): Promise<IUser[]>;
    deleteUser(classId: string, userId: string): Promise<IUser[]>;
    listUsers(id: string): Promise<IUser[]>;
}