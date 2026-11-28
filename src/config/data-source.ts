import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Cargamos el .env manualmente para el CLI de TypeORM
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{js,ts}')],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
