import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from 'src/entities/files.entity';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Files, Admin])],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
