import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { MailService } from './mail.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from '@prisma/client';
import { GetMailDto } from './dtos/get-mail.dto';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';

@UseGuards(JwtGuard)
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async getMail(@CurrentUser() user: User, @Query() getMailDto: GetMailDto) {
    const newMail = await this.mailService.getMail(user, getMailDto);
    return new CommonResponseDto(newMail);
  }
}
