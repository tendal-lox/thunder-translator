import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminDto_Register } from './dto/admin.dto';
import { Public } from './decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Post('register')
  adminAdder(@Body() dto: AdminDto_Register) {
    return this.appService.adminRegistration(dto);
  }
}
