import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import {
  SignUpRequestDTO,
  LoginRequestDto,
  ValidateRequestDto,
} from '../users.dto';
import { User } from '../users.entity';
import { LoginResponse, SignUpResponse, ValidateResponse } from '../users.pb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async signUp(payload: SignUpRequestDTO): Promise<SignUpResponse> {
    const existingUser = await this.userModel.findOne({ email: payload.email });

    if (existingUser) {
      return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }

    const newUser = new this.userModel({
      name: payload.name,
      email: payload.email,
      password: await this.jwtService.encodePassword(payload.password),
      dateOfBirth: payload.dateOfBirth,
      phoneNumber: payload.phoneNumber,
    });

    await newUser.save();

    return { status: HttpStatus.CREATED, error: null };
  }

  public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const existingUser = await this.userModel.findOne({ email: email });
    if(!existingUser){
        return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
    } 
    const isPasswordValid: boolean = await this.jwtService.isPasswordValid(password, existingUser.password);

    if(!isPasswordValid){
        return { status: HttpStatus.NOT_FOUND, error: ['Wrong Password'], token: null }
    }

    const token: string =await this.jwtService.generateToken(existingUser);
    return { token, status: HttpStatus.OK, error: null };
  }

  public async validate({ token }: ValidateRequestDto): Promise<ValidateResponse>{
    const decoded: User = await this.jwtService.verify(token);

    if(!decoded){
        return { status: HttpStatus.FORBIDDEN, error: ['token is invalid'], userId: null }
    }

    const user: User = await this.jwtService.validateUser(decoded);

    if(!user) {
        return { status: HttpStatus.CONFLICT, error: ['User not found'], userId: null };
    }

    return { status: HttpStatus.OK, error: null, userId: decoded.id };
  }

//   public async logout({userId: string})
  
}
