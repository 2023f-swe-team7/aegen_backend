import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../config/database/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('createUserTest', () => {
    it('', () => {
      expect(service).toBeDefined();
    });
    it('createUser Success', async () => {
      const testUser: CreateUserDto = {
        id: 'test1222',
        name: 'jcyy',
        studentId: '2020',
        password: '1234',
        email: 'jcyy@gmail.com',
        major: 'software',
        subject: ['운영체제'],
      };
      const result = await service.createUser(testUser);
      await expect(result).toBeTruthy();
    });
    it('createUser Fail', async () => {
      const testUser: CreateUserDto = {
        id: 'test111',
        name: 'jcyy',
        studentId: '2020',
        password: '1234',
        email: 'jcyy@gmail.com',
        major: 'software',
        subject: ['운영체제'],
      };
      const result = await service.createUser(testUser);
      expect(result).toThrow(new BadRequestException('존재하는 id입니다.'));
    });
  });
});
