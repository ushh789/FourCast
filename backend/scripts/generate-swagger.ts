import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { swaggerConfig } from '../src/configs/swagger.config';

const OUTPUT_DIR = resolve(__dirname, '../generated/openapi');

async function generateSwagger() {
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
    abortOnError: false,
  });

  app.setGlobalPrefix(`/api`, {
    exclude: ['/app'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputPath = resolve(OUTPUT_DIR, 'swagger.json');
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);

  await app.close();
  console.log(`OpenAPI document written to ${outputPath}`);
}

generateSwagger().catch((error: Error) => {
  console.error(`Failed to generate OpenAPI document: ${error.message}`);
  process.exit(1);
});
