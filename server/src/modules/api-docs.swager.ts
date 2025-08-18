import { IApiOptions } from '@common/interface/api-options.interface';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerOptions = {
  persistAuthorization: true,
};

export function setupSwagger(app: INestApplication, api: IApiOptions): void {
  const options = new DocumentBuilder()
    .setTitle('Chat application')
    .setDescription('Chat application System')
    .setVersion(api.version)
    .addTag('Chat application')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  try {
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(`${api.prefix}/${api.version}/docs`, app, document, {
      swaggerOptions,
    });

    console.info(
      `Documentation: http://localhost:${api.port}/${api.prefix}/${api.version}/docs`,
    );
  } catch (error) {
    console.error('Error setting up Swagger:', error);
  }
}
