import { AdminModule } from '@admin/admin.module';
import { ChatModule } from '@modules/chat/chat.module';
import { ContactModule } from '@modules/contact/contact.module';
import { MessagesModule } from '@modules/message/message.module';
import { OtherModule } from '@modules/other/other.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),

    ChatModule,
    AdminModule,
    DatabaseModule,
    OtherModule,
    MessagesModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static nodeEnv: string;
  static port: number;
  static apiVersion: string;
  static apiPrefix: string;
  static documentationEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.nodeEnv = this.configService.get('NODE_ENV') as string;
    AppModule.port = +this.configService.get('API_PORT');
    AppModule.apiVersion = this.configService.get('API_VERSION') as string;
    AppModule.apiPrefix = this.configService.get('API_PREFIX') as string;
    AppModule.documentationEnabled = this.configService.get(
      'ENABLE_DOCUMENTATION',
    ) as boolean; // only for dev mode
  }

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      // FrontendMiddleware,
      // LoggerMiddleware,
      // IpMiddleware,
      // CookieParserMiddleware,
      // RateLimitMiddleware,
      // CorsMiddleware,
      // CSRFMiddleware,
      // HelmetMiddleware,
      // UserMiddleware,
      // LocalsMiddleware,
      // CompressionMiddleware,
    ];
    consumer
      .apply(...middlewares)
      // .exclude('api/(.*)')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
