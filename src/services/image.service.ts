import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  async compressImage(file: Buffer, maxSizeKp: number = 100): Promise<Buffer> {
    let quality = 80;
    let compressedBuffer = await sharp(file).jpeg({ quality }).toBuffer();

    while (compressedBuffer.length > maxSizeKp * 1024 && quality > 10) {
      quality -= 10;
      compressedBuffer = await sharp(file).jpeg({ quality }).toBuffer();
    }

    // If still too large, try resizing
    if (compressedBuffer.length > maxSizeKp * 1024) {
      compressedBuffer = await sharp(file)
        .resize(800) // Standard web width
        .jpeg({ quality: 60 })
        .toBuffer();
    }

    return compressedBuffer;
  }
}
