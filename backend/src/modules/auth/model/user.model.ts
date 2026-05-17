import mongoose, {Schema, Model} from "mongoose";
import bcrypt from "bcryptjs";
import { IUserDocument } from "../interfaces/auth.interface";
import { UserRole } from "@/shared/types";
import { config } from "@/config/env";

// user model interface
interface IUserModel extends Model<IUserDocument> {
    findByEmail(email: string): Promise<IUserDocument | null>;
}

// schema definition
const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minLength: [2, 'Name must be at least 2 characters'],
            maxLength: [100, 'Name cannot exceed 100 characters'],
        },
        
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.SALES,
        },
        
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        emailVerificationToken: {
            type: String,
            select: false,
        },

        emailVerificationExpires: {
            type: Date,
            select: false,
        },

        passwordResetToken: {
            type: String,
            select: false,
        },

        passwordResetExpires: {
            type: Date,
            select: false,
        },

        refreshToken: {
            type: String,
            select: false,
        },

    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: Record<string, unknown>) => {
                delete ret['password'];
                delete ret['emailVerificationToken'];
                delete ret['emailVerificationExpires'];
                delete ret['passwordResetToken'];
                delete ret['passwordResetExpires'];
                delete ret['refreshToken'];
                delete ret['__v'];
                return ret;
            },
        },
    },
);

// hooks
userSchema.pre('save', async function () {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds);
});

// instance methods
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password as string);  
};

// static methods
userSchema.statics.findByEmail = function (email: string){
    return this.findOne({email: email.toLowerCase()}).select('+password');
}

// indexes
userSchema.index({email: 1});
userSchema.index({ emailVerificationToken: 1});
userSchema.index({ passwordResetToken: 1});
userSchema.index({ role: 1});

export const UserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);