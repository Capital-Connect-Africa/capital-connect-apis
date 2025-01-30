import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ShuftiIntegrationService } from './shufti_integration.service';

@Controller('shufti')
export class ShuftiIntegrationController {
  constructor(private readonly shuftiIntegrationService: ShuftiIntegrationService) {}

  @Post('initiate')
  async initiateVerification(@Body() payload: any, @Res() res: any) {
    try {
      const result = await this.shuftiIntegrationService.initiateVerification(payload);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to initiate verification',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Callback endpoint to handle responses from Shufti Pro
  @Post('callback')
  async handleCallback(@Body() callbackData: any, @Res() res: any) {
    console.log('Shufti Callback Data:', callbackData);
    return res.status(HttpStatus.OK).send('Callback received');
  }
}
