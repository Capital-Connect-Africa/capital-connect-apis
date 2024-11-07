import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { WebexIntegrationService } from './webex_integration.service';
import { WebexToken } from '../shared/headers.decorators';

@Controller('webex')
export class WebexIntegrationController {
  constructor(private readonly webexService: WebexIntegrationService) {}

  @Get('authorization/initiation')
  async authorize(@Res() res) {
    const response = this.webexService.authorize();
    res.redirect(response.url);
  }

  @Post('create')
  async createMeeting(@WebexToken() webexToken: string, @Body() body: any) {
    const { topic, startTime, duration } = body;
    return this.webexService.createMeeting(
      webexToken,
      topic,
      new Date(startTime),
      duration,
    );
  }

  @Get(':id')
  async getMeetingDetails(
    @WebexToken() webexToken: string,
    @Param('id') id: string,
  ) {
    return this.webexService.getMeetingDetails(webexToken, id);
  }
}
