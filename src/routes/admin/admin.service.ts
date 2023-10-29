import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin.entity';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

  @OnEvent('translatorFeeds')
  async loadOne({ id }: any) {
    const allRecords = await this.adminRepo.findOneOrFail({
      relations: ['files'],
      where: { id: id },
    });
    const filesData = allRecords.files;

    const pdfFiles = _.reduce(
      filesData,
      (result, eachObj) => {
        (result['pdf'] || (result['pdf'] = [])).push({
          file: eachObj.pdf,
          date: eachObj.date,
        });
        return result;
      },
      {},
    );

    const imageFiles = _.reduce(
      filesData,
      (result, eachObj) => {
        (result['image'] || (result['image'] = [])).push({
          file: eachObj.image,
          date: eachObj.date,
        });
        return result;
      },
      {},
    );

    return { pdfFiles, imageFiles };
  }
}
