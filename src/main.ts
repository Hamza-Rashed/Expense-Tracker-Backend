import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppExceptionFilter } from './errors/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); // Use helmet middleware for security
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': ["'self'"],
      },
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter());

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  await app.listen(PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
