// mail.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'eduardo.abner@hotmail.com',
        pass: 'Eduardo619.',
      },
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
      from: '"Suporte" <no-reply@meusite.com>',
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <p>Você solicitou a recuperação da sua senha.</p>
        <p>Clique no link abaixo para redefinir:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Esse link expira em 15 minutos.</p>
      `,
    })
    } catch (error) {
      throw new BadRequestException('fail with send email')
    }

    ;
  }
}
