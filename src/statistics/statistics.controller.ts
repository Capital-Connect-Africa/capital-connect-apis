import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly userService: StatisticsService) {}

  @Get('users')
  async getUserStatistics() {
    return this.userService.getUserStatistics();
  }
}
