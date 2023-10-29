import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('admin')
export class AdminController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  user(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('files/upload')
  async uploadFile(
    @Req() req: Request,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'image || jpeg || jpg || pdf' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    const uploadedFileData = (
      await this.eventEmitter.emitAsync('uploadingFile', { files })
    )[0];
    return (
      await this.eventEmitter.emitAsync('addToUserEntity', {
        uploadedFileData,
        user: req.user,
      })
    )[0];
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('myfiles')
  async loadOne(@Req() req: Request) {
    return await this.adminService.loadOne(req.user);
  }
}
