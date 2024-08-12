import { Controller, Get } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyTypesController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('list/no-of-employees')
  getNumberOfEmployees() {
    return this.companyService.getNumberOfEmployees();
  }

  @Get('list/years-of-operation')
  getYearsOfOperation() {
    return this.companyService.getYearsOfOperation();
  }
}
