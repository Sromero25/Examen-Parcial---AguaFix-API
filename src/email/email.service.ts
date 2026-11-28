import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(to: string, subject: string, template: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to,
        subject,
        html: template,
      });
      this.logger.log('Correo de alerta enviado exitosamente.');
      return true;
    } catch (error) {
      this.logger.error('No se pudo enviar la notificación por correo. La operación principal continúa.');
      return false;
    }
  }
}
