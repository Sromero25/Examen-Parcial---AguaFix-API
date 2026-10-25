import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
export declare class ReportsService {
    private readonly reportRepository;
    private readonly emailService;
    private readonly storageService;
    constructor(reportRepository: Repository<Report>, emailService: EmailService, storageService: StorageService);
    create(createReportDto: CreateReportDto, photo: any): Promise<Report>;
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    update(id: number, updateReportDto: UpdateReportDto, repairPhoto?: any): Promise<Report & {
        repairPhotoUrl: string;
        address?: string;
        description?: string;
        severity?: string;
        reporterPhone?: string;
        isResolved?: boolean;
    }>;
    remove(id: number): Promise<Report>;
}
