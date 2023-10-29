import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { AdminDto_Register } from './dto/admin.dto';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>) {}

  async adminRegistration(dto: AdminDto_Register) {
    const admin = this.adminRepo.create({
      username: dto.username,
      password: dto.password,
      role: dto.role,
    });
    return this.adminRepo.save(admin);
  }
}
