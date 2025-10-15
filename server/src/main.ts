import { setupSwagger } from '@modules/api-docs.swager';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { rateLimit } from 'express-rate-limit';
import { join } from 'path';
import { AppModule } from './app.module';
import getLogLevels from './Logger/logger';

async function bootstrap() {
  const logger = new Logger('Bootstrap Logger');

  if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
  }

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: getLogLevels(process.env.NODE_ENV === 'production'),
    },
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const API_PREFIX = 'api/v1'; // You can customize this prefix
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //we can whitelist the acceptable properties, and any property not included in the whitelist is automatically stripped from the resulting object. For example, if our handler expects email and password properties, but a request also includes an age property, this property can be automatically removed from the resulting DTO
      transform: true, //dto data transform to help
      skipUndefinedProperties: true, //If set to true then validator will skip validation of all properties that are undefined in the validating object.
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());
  app.use(json({ limit: '20mb' })); //this json data send size defiend
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
    }),
  );
  if (AppModule.documentationEnabled) {
    // need to work on this not working setupSwagger
    setupSwagger(app, {
      port: AppModule.port,
      prefix: AppModule.apiPrefix,
      version: AppModule.apiVersion,
    });
  }

  const PORT = process.env.API_PORT || 3900;
  await app.listen(PORT, () => {
    logger.log(
      `Application listening on port mode. ${process.env.NODE_ENV} http://localhost:${PORT}`,
    );
  });
}
void bootstrap();
