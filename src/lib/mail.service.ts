// mail.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

  async sendPasswordReset(email: string, token: string) {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      try {
        const info = await transporter.sendMail({
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
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info))
      } catch (error) {
        throw new BadRequestException(`fail send email: ${error}`)
      };
  }
}
