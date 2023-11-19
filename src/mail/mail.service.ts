import { BadRequestException, Injectable } from '@nestjs/common';
import { Subject, User } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { GetMailDto, GetMailResponse } from './dtos/get-mail.dto';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

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

  // OAuth2Client를 구성합니다.
  private oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
    
  async sendEmail(receiver: string, subject: string, text: string) {
    this.oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    console.log('OAuth2Client 설정:', this.oauth2Client);
    console.log('이메일 전송 설정:', {
      receiver,
      subject,
      text,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kimdozz01@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
    });

    const mailOptions = {
      from: 'kimdozz01@gmail.com',
      to: receiver, 
      subject: subject, 
      text: text, 
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('이메일 전송 결과:', result);
      return result;
    } catch (error) {
      console.error('이메일 전송 중 오류 발생:', error);
      throw error; // 오류를 다시 throw하여 호출하는 쪽에서도 알 수 있게 함
    }
  }
}
