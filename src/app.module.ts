import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AuthModule } from './auth/auth.module';
import config from 'configorm';
import { AdminModule } from './routes/admin/admin.module';
import { CustomExceptionFilterModule } from './custom-exception-filter/custom-exception-filter.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FilesModule } from './routes/files/files.module';
import { TranslateModule } from './routes/translate/translate.module';
import { TranslateService } from './routes/translate/translate.service';
import { TranslateController } from './routes/translate/translate.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    EventEmitterModule.forRoot({
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    TypeOrmModule.forFeature([Admin]),
    AuthModule,
    AdminModule,
    CustomExceptionFilterModule,
    FilesModule,
    TranslateModule,
  ],
  controllers: [AppController, TranslateController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    JwtService,
    TranslateService,
  ],
})
export class AppModule {}
