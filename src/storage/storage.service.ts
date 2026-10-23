import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { envs } from '../config/envs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client = new S3Client({
    region: envs.AWS_REGION,
    credentials: {
      accessKeyId: envs.AWS_ACCESS_KEY_ID,
      secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Usamos 'any' para evitar errores de TypeScript con Express/Multer
  async uploadFile(file: any, folder: string): Promise<string> {
    const extension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: envs.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return `https://${envs.AWS_S3_BUCKET}.s3.${envs.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      this.logger.error('Error subiendo archivo a S3', error);
      throw error;
    }
  }
}