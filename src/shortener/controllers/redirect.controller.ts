import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RedirectUseCase } from '../usecases/redirect.usecase';
import { RedirectParamsDto } from '../dtos/redirect/params.input';

@ApiTags('Redirect')
@Controller()
export class RedirectController {
  constructor(private readonly redirectUseCase: RedirectUseCase) {}

  @Get(':shortenUrl')
  @ApiOperation({
    summary: 'Redirects to the original URL and counts the access'
  })
  @ApiParam({ name: 'shortenUrl', description: 'Shortened URL code' })
  @ApiResponse({ status: 302, description: 'Redirects to the original URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  async redirect(@Param() params: RedirectParamsDto, @Res() res: Response) {
    const url = await this.redirectUseCase.handleRedirect(params.shortenUrl);
    return res.redirect(url);
  }
}
