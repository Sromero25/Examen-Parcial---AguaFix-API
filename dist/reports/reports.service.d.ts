import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { EmailService } from '../email/email.service';
export declare class ReportsService {
    private readonly reportRepository;
    private readonly emailService;
    constructor(reportRepository: Repository<Report>, emailService: EmailService);
    create(createReportDto: CreateReportDto): Promise<Report>;
    findAll(): Promise<Report[]>;
}
