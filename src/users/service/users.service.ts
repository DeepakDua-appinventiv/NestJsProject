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
      password: this.jwtService.encodePassword(payload.password),
      dateOfBirth: payload.dateOfBirth,
      phoneNumber: payload.phoneNumber,
    });

    await newUser.save();

    return { status: HttpStatus.CREATED, error: null };
  }
}
