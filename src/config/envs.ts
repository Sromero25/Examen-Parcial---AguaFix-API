import 'dotenv/config';
import * as env from 'env-var';

const awsAccessKeyId = env.get('AWS_ACCESS_KEY_ID').asString();
const awsSecretAccessKey = env.get('AWS_SECRET_ACCESS_KEY').asString();

if (Boolean(awsAccessKeyId) !== Boolean(awsSecretAccessKey)) {
  throw new Error(
    'AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY deben configurarse juntas o omitirse para usar la cadena de credenciales predeterminada de AWS.',
  );
}

export const envs = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USERNAME: env.get('DB_USERNAME').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
  MAINTENANCE_EMAIL: env.get('MAINTENANCE_EMAIL').required().asString(),
  AWS_REGION: env.get('AWS_REGION').required().asString(),
  AWS_ACCESS_KEY_ID: awsAccessKeyId,
  AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
  AWS_S3_BUCKET: env.get('AWS_S3_BUCKET').required().asString(),
};
