import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/database/prisma.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: Request, loginRequsetDto: LoginRequestDto) {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: loginRequsetDto.id,
      },
    });

    if (
      !user ||
      !(await bcrypt.compare(loginRequsetDto.password, user.password))
    ) {
      throw new UnauthorizedException('ID나 비밀번호가 올바르지 않습니다');
    }

    return this.jwtService.sign({
      id: user.id,
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          username: createUserDto.name,
          password: this.createHash(createUserDto.password),
          studentId: createUserDto.studentId,
          studentEmail: createUserDto.email,
          id: createUserDto.id,
          major: createUserDto.major,
        },
      });
      createUserDto.subject.forEach(async (subject) => {
        const currentSubject = await this.prismaService.subject.findFirst({
          where: {
            subjectName: subject,
          },
        });
        if (!currentSubject)
          throw new BadRequestException('해당 과목이 존재하지 않습니다.');
        await this.prismaService.signUp.create({
          data: {
            userId: createUserDto.id,
            subjectId: currentSubject.id,
          },
        });
      });
      return createdUser;
    } catch (e) {
      console.log({ e });
      throw new BadRequestException('존재하는 id입니다');
    }
  }

  createHash(password: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }
}
