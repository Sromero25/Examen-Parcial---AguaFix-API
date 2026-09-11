import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]), 
    EmailModule // Importamos el módulo para poder usar EmailService
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}