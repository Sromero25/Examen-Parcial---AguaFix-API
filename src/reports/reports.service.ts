import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { EmailService } from '../email/email.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly emailService: EmailService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    // 1. Guardar reporte en base de datos
    const report = this.reportRepository.create(createReportDto);
    await this.reportRepository.save(report);

    // 2. Generar plantilla HTML
    const emailTemplate = generateReportTemplate(createReportDto);

    // 3. Enviar el correo a la cuadrilla
    await this.emailService.sendEmail(
      envs.MAINTENANCE_EMAIL, 
      `Alerta de Fuga - Prioridad ${createReportDto.severity.toUpperCase()}`, 
      emailTemplate
    );

    return report;
  }

  async findAll() {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}