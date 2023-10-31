import { Body, Controller, Inject, OnModuleInit, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UsersServiceClient, SignUpResponse, SignUpRequest, USERS_SERVICE_NAME, LoginRequest, LoginResponse } from './users.pb';

@Controller('users')
export class UsersController implements OnModuleInit {
  private svc: UsersServiceClient;

  @Inject(USERS_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  @Post('signup')
  private async signup(@Body() body: SignUpRequest): Promise<Observable<SignUpResponse>> {
    return this.svc.signUp(body);
  }

  @Post('login')
  private async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }
}