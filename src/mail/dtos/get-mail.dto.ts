import { IsNotEmpty, IsString } from 'class-validator';

export class GetMailDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  subject: string;
}

export class GetMailResponse {
  constructor(mail: string, email:string) {
    this.mail = mail;
    this.professorEmail = email;
  }
  mail: string;
  professorEmail: string;
}