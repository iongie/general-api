import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

export const createMulterConfig = (configService: ConfigService): MulterOptions => ({
  storage: memoryStorage(), // Use memory storage for FTP upload
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/avi',
      'video/mov',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only images, videos, audio, documents, and archives are allowed.'), false);
    }
  },
  limits: {
    fileSize: configService.get<number>('MAX_FILE_SIZE', 50 * 1024 * 1024), // Default 50MB
    files: configService.get<number>('MAX_FILES_PER_REQUEST', 5), // Default 5 files
    fieldSize: 1024 * 1024, // 1MB for field values
  },
});

// Default config for backward compatibility
export const multerConfig: MulterOptions = {
  storage: memoryStorage(), // Use memory storage for FTP upload
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/avi',
      'video/mov',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only images, videos, audio, documents, and archives are allowed.'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5, // Maximum 5 files per request
    fieldSize: 1024 * 1024, // 1MB for field values
  },
};
