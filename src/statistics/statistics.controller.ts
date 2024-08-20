import { Controller, Get, UseGuards } from "@nestjs/common";
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../auth/role.enum";

@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly userService: StatisticsService) {}

  @Get('users')
  async getUserStatistics() {
    return this.userService.getUserStatistics();
  }
}
