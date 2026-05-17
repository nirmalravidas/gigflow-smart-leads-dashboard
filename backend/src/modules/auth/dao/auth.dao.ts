import { UserModel } from '../model/user.model';
import { IUserDocument, ICreateUserDto, IAuthDao } from '../interfaces/auth.interface';

// auth DAO
class AuthDao implements IAuthDao {

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findUserById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findUserByTokenField(
    field: string,
    hashedToken: string,
    expiryField: string,
  ): Promise<IUserDocument | null> {
    return UserModel.findOne({
      [field]: hashedToken,
      [expiryField]: { $gt: new Date() },
    }).select(`+${field} +${expiryField}`);
  }

  async findUserByRefreshToken(hashedToken: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ refreshToken: hashedToken }).select('+refreshToken');
  }

  async createUser(data: ICreateUserDto): Promise<IUserDocument> {
    return UserModel.create(data);
  }

  async updateUser(
    id: string,
    updates: Partial<Record<string, unknown>>,
  ): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  async unsetFields(id: string, fields: string[]): Promise<void> {
    const unsetObj = fields.reduce<Record<string, number>>((acc, f) => {
      acc[f] = 1;
      return acc;
    }, {});
    await UserModel.findByIdAndUpdate(id, { $unset: unsetObj });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}

export const authDao = new AuthDao();
