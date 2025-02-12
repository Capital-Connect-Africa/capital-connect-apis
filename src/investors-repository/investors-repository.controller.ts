import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
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
  async createInvestor(@Body() body: InvestorRepositoryDto) {
    try {
      return await this.investorRespositoryService.createInvestor(body);
    } catch (error) {
      handleError(error, RequestMethod.POST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Fetch a paginated list of external investors.' })
  @ApiOkResponse({
    description: 'External investors retrieved successfully',
    type: InvestorsRepository,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async getInvestors(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.investorRespositoryService.getInvestors(page, limit);
    } catch (error) {
      handleError(error, RequestMethod.GET);
    }
  }

  @Get(':investorId')
  @ApiOperation({ summary: 'Fetch an external investor by id.' })
  @ApiOkResponse({
    description: 'External investor retrieved successfully',
    type: InvestorsRepository,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async getInvestor(@Param('investorId') investorId: number) {
    try {
      return await this.investorRespositoryService.getInvestor(investorId);
    } catch (error) {
      handleError(error, RequestMethod.GET);
    }
  }

  @Roles(Role.Admin)
  @Put(':investorId')
  @ApiOperation({ summary: 'Update external investor details' })
  @ApiOkResponse({
    description: 'Investor details updated successfully',
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
  @ApiNotFoundResponse({
    description: 'Investor with id not found',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async updateInvestor(
    @Param('investorId') investorId: number,
    @Body() payload: Partial<InvestorRepositoryDto>,
  ) {
    try {
      return await this.investorRespositoryService.updateInvestor(
        investorId,
        payload,
      );
    } catch (error) {
      handleError(error, RequestMethod.GET);
    }
  }

  @Roles(Role.Admin)
  @Delete(':investorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove external investor' })
  @ApiNoContentResponse({
    description: 'External investor removed successfully',
    type: null,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor with id not found',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async removeInvestor(@Param('investorId') investorId: number) {
    try {
      return await this.investorRespositoryService.removeInvestor(investorId);
    } catch (error) {
      handleError(error, RequestMethod.DELETE);
    }
  }
}
