import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.entity';
import { UsersService } from './service/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
    JwtModule.register({
      secret: 'dev',
      signOptions: {expiresIn: '2h'}
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, JwtStrategy],
})
export class UsersModule {}
