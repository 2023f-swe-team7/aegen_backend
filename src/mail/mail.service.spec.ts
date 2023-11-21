import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../config/database/prisma.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [MailService, PrismaService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
