import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService, // Inyectamos StorageService
  ) {}

  async create(createReportDto: CreateReportDto, photo: any) {
    // 1. Subir la foto a S3
    const photoUrl = await this.storageService.uploadFile(photo, 'reports');

    // 2. Guardar en DB con la URL generada
    const report = this.reportRepository.create({ 
      ...createReportDto, 
      photoUrl: photoUrl 
    });
    await this.reportRepository.save(report);

    // 3. Generar HTML
    const emailTemplate = generateReportTemplate(createReportDto, photoUrl);

    // 4. Enviar el correo
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

  async findOne(id: number) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`El reporte con ID ${id} no fue encontrado`);
    }
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto, repairPhoto?: any) {
    const report = await this.findOne(id);
    let repairPhotoUrl = report.repairPhotoUrl;

    if (repairPhoto) {
      repairPhotoUrl = await this.storageService.uploadFile(repairPhoto, 'repairs');
      updateReportDto.isResolved = true; 
    }

    // Convertir de string a booleano porque form-data envía todo como texto
    if (typeof updateReportDto.isResolved === 'string') {
      updateReportDto.isResolved = updateReportDto.isResolved === 'true';
    }

    const updatedReport = Object.assign(report, { ...updateReportDto, repairPhotoUrl });
    return this.reportRepository.save(updatedReport);
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    return this.reportRepository.remove(report);
  }
}