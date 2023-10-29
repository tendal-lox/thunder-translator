import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { SerializedAdmin } from 'src/datafiltering/admin.serializer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const foundAdmin = await this.adminRepo.findOneByOrFail({ username });

    if (foundAdmin && (await bcrypt.compare(password, foundAdmin.password)))
      return plainToClass(SerializedAdmin, foundAdmin);

    return null;
  }

  async login({ user }: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
