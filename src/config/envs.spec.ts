const mockEnvironment: Record<string, string | undefined> = {};

jest.mock('dotenv/config', () => ({}));
jest.mock('env-var', () => ({
  get: (name: string) => {
    let defaultValue: string | number | undefined;
    let required = false;

    const variable = {
      default: (value: string | number) => {
        defaultValue = value;
        return variable;
      },
      required: () => {
        required = true;
        return variable;
      },
      asString: () => {
        const value = mockEnvironment[name] ?? defaultValue;
        if (required && value === undefined) {
          throw new Error(`${name} is required`);
        }
        return value === undefined ? undefined : String(value);
      },
      asPortNumber: () => {
        const value = mockEnvironment[name] ?? defaultValue;
        if (required && value === undefined) {
          throw new Error(`${name} is required`);
        }
        return Number(value);
      },
    };

    return variable;
  },
}));

const requiredEnvironment = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USERNAME: 'test-user',
  DB_PASSWORD: 'test-password',
  DB_NAME: 'test-db',
  MAILER_SERVICE: 'test-mailer',
  MAILER_EMAIL: 'test@example.com',
  MAILER_SECRET_KEY: 'test-mailer-secret',
  MAINTENANCE_EMAIL: 'maintenance@example.com',
  AWS_REGION: 'us-east-2',
  AWS_S3_BUCKET: 'aguafix-fotos-us-east-2-eq1-2026',
};

describe('envs AWS credentials', () => {
  beforeEach(() => {
    Object.keys(mockEnvironment).forEach((key) => delete mockEnvironment[key]);
    Object.assign(mockEnvironment, requiredEnvironment);
    jest.resetModules();
  });

  it('allows IAM Role credentials when static AWS credentials are omitted', () => {
    const { envs } = require('./envs');

    expect(envs.AWS_ACCESS_KEY_ID).toBeUndefined();
    expect(envs.AWS_SECRET_ACCESS_KEY).toBeUndefined();
  });

  it('accepts both legacy static AWS credential variables', () => {
    mockEnvironment.AWS_ACCESS_KEY_ID = 'test-access-key';
    mockEnvironment.AWS_SECRET_ACCESS_KEY = 'test-secret-key';

    const { envs } = require('./envs');

    expect(envs.AWS_ACCESS_KEY_ID).toBe('test-access-key');
    expect(envs.AWS_SECRET_ACCESS_KEY).toBe('test-secret-key');
  });

  it('rejects partial static AWS credentials', () => {
    mockEnvironment.AWS_ACCESS_KEY_ID = 'test-access-key';

    expect(() => require('./envs')).toThrow(
      'AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY deben configurarse juntas',
    );
  });
});
