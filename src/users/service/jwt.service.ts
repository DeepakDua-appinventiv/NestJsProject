import { Injectable } from '@nestjs/common';
import { JwtService as jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users.entity';

@Injectable()
export class JwtService {
  private readonly jwt: jwt;

  constructor(
    jwt: jwt,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.jwt=jwt;
  }

  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token);
  }

  public async validateUser(decoded: any): Promise<User | null> {
    return this.userModel.findById(decoded.id).exec();
  }

  public generateToken(auth: User): string {
    return this.jwt.sign({ id: auth._id, email: auth.email });
  }

  public isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  public async encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {
      throw err;
    }
  }
}
