export interface IUser {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeam {
    id: string;
    teamName: string;
    teamCode: string;
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

export interface IUserService {
    updateUsername(id: string, username: string): Promise<IUser>;
    delete(id: string): Promise<IUser>;
    findById(id: string): Promise<IUser>;
    listUserClasses(id: string): Promise<IClass[]>;
    listUserTeams(id: string): Promise<ITeam[]>;
}