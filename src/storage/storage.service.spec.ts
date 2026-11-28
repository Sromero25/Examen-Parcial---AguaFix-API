const mockSend = jest.fn();
const mockS3Client = jest.fn().mockImplementation(() => ({ send: mockSend }));

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: mockS3Client,
  PutObjectCommand: jest.fn(),
}));

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../config/envs', () => ({
  envs: {
    AWS_REGION: 'us-east-2',
    AWS_S3_BUCKET: 'aguafix-fotos-us-east-2-eq1-2026',
    AWS_ACCESS_KEY_ID: 'existing-access-key',
    AWS_SECRET_ACCESS_KEY: 'existing-secret-key',
  },
}));

import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => {
    mockS3Client.mockClear();
    mockSend.mockClear();
  });

  it('initializes S3 with the default AWS credential provider chain', () => {
    new StorageService();

    expect(mockS3Client).toHaveBeenCalledWith({ region: 'us-east-2' });
  });

  it('does not pass legacy static credentials to the S3 client', () => {
    new StorageService();

    expect(mockS3Client.mock.calls[0][0]).not.toHaveProperty('credentials');
  });
});
