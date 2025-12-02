import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      cors: true,
      // logger: new MyLogger(),
      bodyParser: true,
    }
  );
  // Configure body size limits
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true, // tolak request yang bawa field liar (400)
    transformOptions: { enableImplicitConversion: true }, // cast "123"→123 tanpa @Type
    stopAtFirstError: true, // (opsional) cepat gagal saat ada error pertama
  }));

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Define admin path for static files
  const adminRoot = join(__dirname, '..', 'public/administrator', 'browser');

  // Serve static files for admin (without /administrator prefix, serve at root)
  app.use(express.static(adminRoot, { index: false, maxAge: '1y' }));

  // Helper to check if URL is an asset file
  const isAssetFile = (url: string): boolean => {
    const assetExtensions = ['.js', '.mjs', '.css', '.map', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.txt', '.json', '.woff', '.woff2', '.ttf', '.otf'];
    return assetExtensions.some(ext => url.endsWith(ext));
  };

  // Admin SPA fallback (serve index.html for non-API, non-asset routes)
  app.use('/', (req, res, next) => {
    // Skip for API routes
    if (req.originalUrl.startsWith('/api')) return next();
    // Skip for Swagger docs
    if (req.originalUrl.startsWith('/api-docs')) return next();
    // Skip for asset files
    if (isAssetFile(req.originalUrl)) return next();
    
    // Serve admin index.html for all other routes
    res.sendFile(join(adminRoot, 'index.html'));
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
