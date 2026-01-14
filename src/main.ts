import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppExceptionFilter } from './errors/app-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API - Back-End')
    .setDescription('Track expenses, budgets and transactions efficiently.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  await app.listen(PORT ?? 3000);

}
bootstrap();
