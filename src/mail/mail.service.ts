import { BadRequestException, Injectable } from '@nestjs/common';
import { Subject, User } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { GetMailDto, GetMailResponse } from './dtos/get-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly prisma: PrismaService) {}

  async getMail(user: User, getMailDto: GetMailDto) {
    const { type, subject } = getMailDto;
    const subjectInfo: Subject = await this.prisma.subject.findFirst({
      where: {
        subjectName: subject,
      },
    });
    const mailFormat = await this.prisma.mail.findFirst({
      where: {
        type: type,
      },
    });
    if (!subjectInfo || !mailFormat)
      throw new BadRequestException('올바른 타입과 과목이름을 적어주세요');
    const newMail = this.generateMail(mailFormat.content, subjectInfo, user);
    console.log(newMail);
    return new GetMailResponse(newMail, subjectInfo.professorEmail);
  }

  generateMail(template: string, subjectInfo: Subject, userInfo: User) {
    let tmpMail = template.replace(/major/gi, userInfo.major);
    tmpMail = tmpMail.replace(/subjectNum/gi, subjectInfo.subjectNum);
    tmpMail = tmpMail.replace(/subjectName/gi, subjectInfo.subjectName);
    tmpMail = tmpMail.replace(/username/gi, userInfo.username);
    tmpMail = tmpMail.replace(/studentId/gi, userInfo.studentId);
    tmpMail = tmpMail.replace(/professor_name/gi, subjectInfo.professorName);
    tmpMail = tmpMail.replace(/rn/gi, '\\n');
    return tmpMail;
  }
}
