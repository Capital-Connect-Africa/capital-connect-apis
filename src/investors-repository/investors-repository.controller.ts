import {
  Body,
  Controller,
  Post,
  RequestMethod,
  UseGuards,
} from '@nestjs/common';
import { InvestorsRepositoryService } from './investors-repository.service';
import { InvestorsRepository } from './entities/investors-repository.entity';
import { ErrorDto } from 'src/shared/generic/error.dto';
import { InvestorRepositoryDto } from './dto/investor-repository.dto';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { handleError } from 'src/shared/helpers/error-handler.helper';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('investors repository')
@Controller('investors-repository')
export class InvestorsRepositoryController {
  constructor(private investorRespositoryService: InvestorsRepositoryService) {}
  @Roles(Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Adds a new external investor to the repository' })
  @ApiCreatedResponse({
    description: 'New external investor added successfully',
    type: InvestorsRepository,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async createVoucher(@Body() body: InvestorRepositoryDto) {
    try {
      return await this.investorRespositoryService.createInvestor(body);
    } catch (error) {
      handleError(error, RequestMethod.POST);
    }
  }
}
