import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../config/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { LoginRequestDto } from './dtos/login-request.dto';

const requestMock = {} as any;
const LoginReqDtoMock = {} as LoginRequestDto;
const responseMock = { accessToken: {} } as any;
describe('AuthController', () => {
  let authController: AuthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('auth', () => {
    it('loginController', async () => {
      const result = await authController.login(requestMock, LoginReqDtoMock);
      expect(result).toBe(responseMock);
    });
  });
});
