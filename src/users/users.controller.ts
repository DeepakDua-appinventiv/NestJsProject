import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SignUpRequestDTO, LoginRequestDto, ValidateRequestDto, LogoutRequestDto } from './users.dto';
import { USERS_SERVICE_NAME, SignUpResponse, LoginResponse, ValidateResponse } from './users.pb';
import { UsersService } from './service/users.service';

@Controller()
export class UsersController {
    @Inject(UsersService)
    private readonly service: UsersService;

    @GrpcMethod(USERS_SERVICE_NAME, 'signUp')
    private signUp(payload: SignUpRequestDTO): Promise<SignUpResponse> {
        return this.service.signUp(payload);
    }

    
}

