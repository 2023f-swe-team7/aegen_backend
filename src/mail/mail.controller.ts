import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { MailService } from './mail.service';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { User } from '@prisma/client';
import { GetMailDto } from './dtos/get-mail.dto';
import { CommonResponseDto } from '../common/dtos/common-response.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getMail(@CurrentUser() user: User, @Query() getMailDto: GetMailDto) {
    const newMail = await this.mailService.getMail(user, getMailDto);
    return new CommonResponseDto(newMail);
  }

  @Post('/send')
  async sendMail(
    @Body() body: { receiver: string; subject: string; text: string },
  ) {
    console.log(body);
    return await this.mailService.sendEmail(
      body.receiver,
      body.subject,
      body.text,
    );
  }
}
