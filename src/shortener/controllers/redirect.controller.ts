import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RedirectUseCase } from '../usecases/redirect.usecase';

@ApiTags('Redirect')
@Controller()
export class RedirectController {
  constructor(private readonly redirectUseCase: RedirectUseCase) {}

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Redirects to the original URL and counts the access'
  })
  @ApiParam({ name: 'shortCode', description: 'Shortened URL code' })
  @ApiResponse({ status: 302, description: 'Redirects to the original URL' })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.redirectUseCase.handleRedirect(shortCode);
    return res.redirect(url);
  }
}
