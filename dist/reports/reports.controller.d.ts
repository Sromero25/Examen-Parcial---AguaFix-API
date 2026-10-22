import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(createReportDto: CreateReportDto): Promise<import("./entities/report.entity").Report>;
    findAll(): Promise<import("./entities/report.entity").Report[]>;
    findOne(id: number): Promise<import("./entities/report.entity").Report>;
    update(id: number, updateReportDto: UpdateReportDto): Promise<import("./entities/report.entity").Report & UpdateReportDto>;
    remove(id: number): Promise<import("./entities/report.entity").Report>;
}
