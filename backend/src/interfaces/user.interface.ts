import { UserRole } from "../enums/user-role.enum";
import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?:string;
    passwordResetExpires?: Date;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserPublic {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: Date;
}

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}