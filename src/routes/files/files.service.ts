import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as async from 'async';
import * as path from 'path';
import { mkdir, writeFile } from 'node:fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from 'src/entities/files.entity';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/admin.entity';
import * as _ from 'lodash';

@Injectable()
export class FilesService {
  private logger = new Logger(FilesService.name);

  constructor(
    @InjectRepository(Files) private filesRepo: Repository<Files>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {}

  async writeSingleFile(file: Express.Multer.File, dir: string) {
    const uploadDirectory = path.join(process.env.BASE_FILE_PATH, dir);
    const filePath = path.join(
      uploadDirectory,
      new Date().getTime().toString(16) + '_' + file.originalname,
    );

    mkdir(uploadDirectory, { recursive: true })
      .then((_) => {
        writeFile(filePath, file.buffer);
      })
      .catch((err) =>
        this.logger.error(
          err,
          'Something went wrong in creating or writing file',
        ),
      );

    return { filePath };
  }

  @OnEvent('uploadingFile')
  async multipleFileHandler({ files }: { files: Express.Multer.File[] }) {
    try {
      return async.mapLimit(files, 1, async (file: any) => {
        let dir = '';
        const typeOfWord = file.originalname.endsWith('.pdf');
        switch (typeOfWord) {
          case true:
            dir = 'pdf';
            break;
          default:
            dir = 'image';
        }
        const { filePath } = await this.writeSingleFile(file, dir);
        return { filePath, dir };
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  @OnEvent('addToUserEntity')
  async addingFileToUserEntity({
    uploadedFileData,
    user,
  }: {
    uploadedFileData: any;
    user: any;
  }) {
    const currentUser = await this.adminRepo.findOneByOrFail({ id: user.id });

    const sortedData = _.groupBy(uploadedFileData, (each) => each.dir);
    const pdf = sortedData.pdf?.map((each) => each.filePath);
    const image = sortedData.image?.map((each) => each.filePath);

    const data = this.filesRepo.create({
      admin: currentUser,
    });
    if (pdf) data.pdf = [...pdf];
    if (image) data.image = [...image];

    const result = await this.filesRepo.save(data);

    return {
      result,
    };
  }
}
