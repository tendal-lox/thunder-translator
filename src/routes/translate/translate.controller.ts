import { Controller, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { TranslateService } from './translate.service';

@Controller('translate')
export class TranslateController {
  constructor(
    private readonly translateService: TranslateService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  async translator(
    @Req() req: Request,
    @Res() res: Response,
    @Query('name') fileName: string,
    @Query('translateFrom') translateFrom: string,
    @Query('translateTo') translateTo: string
  ) {
    const data = (await this.eventEmitter.emitAsync('translatorFeeds', req.user))[0];
    const extractedText = await this.translateService.extractor(data, fileName);
    return this.translateService.translator(res, extractedText, translateFrom, translateTo)
  }
}
