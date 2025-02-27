import { Body, Controller, Delete, Get, Param, Post, Res } from "@nestjs/common";
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
  async createMeeting(
    @WebexToken() webexToken: string,
    @Body() body: any
  ) {
    const { title, start, end, timezone, invitees, bookingId } = body;
    return this.webexService.createMeeting(
      webexToken,
      title,
      start,
      end,
      timezone,
      invitees,
      bookingId,
    );
  }


  @Post('calendly-callback')
  async CalendlyCallback(@Body() body: any) {
    const {
      payload: {
          tracking: { utm_content },
          event: calendlyEventUrl,
          scheduled_event: { start_time: meetingStartTime, end_time: meetingEndTime }
      }
    } = body;

    const calendlyEventId = calendlyEventUrl.split('/').pop();

    return  this.webexService.saveCalendlyMeeting(
      calendlyEventId,
      utm_content,
      meetingStartTime,
      meetingEndTime
    ); 
  }


  @Get('authorizations')
  async getAuthorizations(
    @WebexToken() webexToken: string,
    @Param('id') id: string,
  ) {
    return this.webexService.getAuthorizations(webexToken);
  }

  @Get(':id')
  async getMeetingDetails(
    @WebexToken() webexToken: string,
    @Param('id') id: string,
  ) {
    return this.webexService.getMeetingDetails(webexToken, id);
  }

  @Delete('authorizations')
  async deleteAuthorizations(
    @WebexToken() webexToken: string
  ) {
    return this.webexService.deleteAuthorizations(webexToken);
  }
}
