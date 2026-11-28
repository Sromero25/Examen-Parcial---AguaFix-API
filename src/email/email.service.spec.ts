const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn().mockImplementation(() => ({ sendMail: mockSendMail }));

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport,
}));

jest.mock('../config/envs', () => ({
  envs: {
    MAILER_SERVICE: 'test-mailer',
    MAILER_EMAIL: 'notifications@example.invalid',
    MAILER_SECRET_KEY: 'test-mailer-secret',
  },
}));

import { Logger } from '@nestjs/common';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let loggerLog: jest.SpyInstance;
  let loggerError: jest.SpyInstance;

  beforeEach(() => {
    mockSendMail.mockReset();
    mockCreateTransport.mockClear();
    loggerLog = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    service = new EmailService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends email through the configured transport', async () => {
    mockSendMail.mockResolvedValue({});

    await expect(service.sendEmail('maintenance@example.invalid', 'Alerta', '<p>Reporte</p>')).resolves.toBe(true);

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'notifications@example.invalid',
      to: 'maintenance@example.invalid',
      subject: 'Alerta',
      html: '<p>Reporte</p>',
    });
    expect(loggerLog).toHaveBeenCalledWith('Correo de alerta enviado exitosamente.');
  });

  it('records a safe error and preserves the non-blocking notification behavior on SMTP failure', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP failure for maintenance@example.invalid'));

    await expect(service.sendEmail('maintenance@example.invalid', 'Alerta', '<p>Reporte</p>')).resolves.toBe(false);

    expect(loggerError).toHaveBeenCalledWith(
      'No se pudo enviar la notificación por correo. La operación principal continúa.',
    );
    expect(loggerError.mock.calls.flat()).not.toContain('maintenance@example.invalid');
  });
});
