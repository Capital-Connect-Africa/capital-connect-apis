import { Controller, Get } from "@nestjs/common";
import { AdvisorProfileService } from "./advisor_profile.service";

@Controller('advisor-profile')
export class AdvisorTypesController {
  constructor(private readonly advisorProfileService: AdvisorProfileService) {}

  @Get('list/roles')
    roles() {
      return this.advisorProfileService.roles();
  }

  @Get('list/services-offered')
    servicesOffered() {
      return this.advisorProfileService.servicesOffered();
  }

  @Get('list/fee-structure')
    feeStructure() {
      return this.advisorProfileService.feeStructure();
  }
}