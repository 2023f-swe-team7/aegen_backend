import { Body, Controller, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Request } from 'express';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Req() req: Request, @Body() loginRequsetDto: LoginRequestDto) {
    const accessToken = await this.authService.login(req, loginRequsetDto);

    return new CommonResponseDto({
      accessToken,
    });
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newAccount = await this.authService.createUser(createUserDto);
    return new CommonResponseDto(newAccount);
  }
}
