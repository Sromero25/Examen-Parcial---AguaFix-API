jest.mock('../config/envs', () => ({
  envs: { MAINTENANCE_EMAIL: 'maintenance@example.invalid' },
}));

jest.mock('../email/email.service', () => ({
  EmailService: class EmailService {},
}));

jest.mock('../storage/storage.service', () => ({
  StorageService: class StorageService {},
}));

import { Logger } from '@nestjs/common';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  it('preserves a saved report when its notification cannot be sent', async () => {
    const report = { id: 42, address: 'Test address', photoUrl: 'https://example.invalid/reports/photo.jpg' };
    const repository = {
      create: jest.fn().mockReturnValue(report),
      save: jest.fn().mockResolvedValue(report),
    };
    const storageService = {
      uploadFile: jest.fn().mockResolvedValue(report.photoUrl),
    };
    const emailService = {
      sendEmail: jest.fn().mockResolvedValue(false),
    };
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const service = new ReportsService(repository as any, emailService as any, storageService as any);

    await expect(
      service.create(
        {
          address: 'Test address',
          description: 'Test description',
          severity: 'high',
          reporterPhone: '0000000000',
        },
        { originalname: 'photo.jpg', buffer: Buffer.from('test'), mimetype: 'image/jpeg' },
      ),
    ).resolves.toBe(report);

    expect(repository.save).toHaveBeenCalledWith(report);
    expect(emailService.sendEmail).toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledWith(
      'No se pudo enviar la notificación del reporte 42; el reporte fue guardado.',
    );

    loggerError.mockRestore();
  });
});
