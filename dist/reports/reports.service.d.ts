import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { EmailService } from '../email/email.service';
export declare class ReportsService {
    private readonly reportRepository;
    private readonly emailService;
    constructor(reportRepository: Repository<Report>, emailService: EmailService);
    create(createReportDto: CreateReportDto): Promise<Report>;
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    update(id: number, updateReportDto: UpdateReportDto): Promise<Report & UpdateReportDto>;
    remove(id: number): Promise<Report>;
}
