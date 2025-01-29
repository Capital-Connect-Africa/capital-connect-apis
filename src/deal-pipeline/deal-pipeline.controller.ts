import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  RequestMethod,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { DealPipelineService } from './deal-pipeline.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { ErrorDto } from 'src/shared/generic/error.dto';
import { handleError } from 'src/shared/helpers/error-handler.helper';
import { DealDto } from './dto/deal.dto';
import { Deal } from './entities/deal.entity';
import { DealStageDto } from './dto/deal-stage.dto';
import { DealStage } from './entities/deal-stage.entity';
import { DealCustomerDto } from './dto/deal-customer.dto';
import { DealPipelineDto } from './dto/deal-pipeline.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Investor)
@ApiTags('Deal Pipeline')
@Controller('deal-pipelines')
export class DealPipelineController {
  constructor(private dealPipelineService: DealPipelineService) {}
  @Post()
  @ApiOperation({ summary: 'Creates a new deal deal pipeline' })
  @ApiCreatedResponse({
    description: 'New deal pipeline created successfully',
    type: Deal,
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
  async createPipeline(@Body() body: DealPipelineDto) {
    try {
      return await this.dealPipelineService.createPipeline(body);
    } catch (error) {
      handleError(error, RequestMethod.POST);
    }
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Fetch a list of deal pipelines.' })
  @ApiOkResponse({
    description: 'Deal pipelines retrieved successfully',
    type: Deal,
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
  async findDeals(@Param('ownerId') ownerId: number) {
    try {
      const deals =
        await this.dealPipelineService.findAllUserPipelines(ownerId);
      return deals;
    } catch (error) {
      handleError(error, RequestMethod.GET);
    }
  }
}
