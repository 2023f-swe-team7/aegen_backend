import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { PrismaService } from '../config/database/prisma.service';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [MailController],
      providers: [MailService, PrismaService],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
