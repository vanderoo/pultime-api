export interface IUser {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IToken {
    userId: string;
    accessToken: string;
    accessTokenExpires: Date;
    refreshToken?: string;
}
  
export interface IAuthService {
    signup(email: string, username: string, password: string, confirmPassword: string): Promise<IUser>;
    login(username: string, password: string): Promise<IToken>;
    logout(token: string): Promise<void>
    requestResetPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<IToken>;
}