import { Injectable, Logger } from '@nestjs/common';
import Client from 'ssh2-sftp-client';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class SftpService {
  private client: Client;
  private readonly logger = new Logger(SftpService.name);

  constructor(private configService: ConfigService) {
    this.client = new Client();
  }

  private async connect() {
    try {
      await this.client.connect({
        host: this.configService.get<string>('SFTP_HOST'),
        port: this.configService.get<number>('SFTP_PORT', 22),
        username: this.configService.get<string>('SFTP_USERNAME'),
        password: this.configService.get<string>('SFTP_PASSWORD'),
      });
    } catch (err) {
      this.logger.error('Failed to connect to SFTP server', err);
      throw err;
    }
  }

  private async disconnect() {
    await this.client.end();
  }

  async uploadFile(remotePath: string, fileBuffer: Buffer): Promise<string> {
    await this.connect();
    try {
      // Ensure directory exists, might be needed
      const remoteDir = remotePath.substring(0, remotePath.lastIndexOf('/'));
      const exists = await this.client.exists(remoteDir);
      if (!exists) {
        await this.client.mkdir(remoteDir, true);
      }

      await this.client.put(fileBuffer, remotePath);
      return remotePath;
    } catch (err) {
      this.logger.error(`Failed to upload file to ${remotePath}`, err);
      throw err;
    } finally {
      await this.disconnect();
    }
  }
}
