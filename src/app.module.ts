import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipeModule } from './recipe/recipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { envValidationSchema } from './config/envValidation.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    RecipeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
