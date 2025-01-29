import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiNoContentResponse,
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
import { DealPipeline } from './entities/deal-pipeline.entity';

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
    type: DealPipeline,
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
  @ApiOperation({ summary: 'Fetch a list of user deal pipelines.' })
  @ApiOkResponse({
    description: 'User Deal pipelines retrieved successfully',
    type: DealPipeline,
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
  async findAllUserPipelines(@Param('ownerId') ownerId: number) {
    try {
      return this.dealPipelineService.findAllUserPipelines(ownerId);
    } catch (error) {
      handleError(error, RequestMethod.GET);
    }
  }

  @Get(':pipelineId')
  @ApiOperation({ summary: 'Fetch a deal pipeline by id' })
  @ApiOkResponse({
    description: 'A Deal pipeline retrieved successfully',
    type: DealPipeline,
  })
  @ApiNotFoundResponse({
    description: 'Deal pipeline Id was not found',
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async findOnePipeline(@Param('pipelineId') pipelineId: number) {
    try {
      return await this.dealPipelineService.findOnePipeline(pipelineId);
    } catch (error) {
      handleError(error, RequestMethod.GET);
    }
  }

  @Put(':pipelineId')
  @ApiOperation({ summary: 'Updates details of a deal pipeline by id' })
  @ApiOkResponse({
    description: 'Deal pipeline was updated successfully',
    type: DealPipeline,
  })
  @ApiNotFoundResponse({
    description: 'Deal pipeline Id was not found',
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async updatePipeline(
    @Body() payload: Partial<DealPipelineDto>,
    @Param('pipelineId') pipelineId: number,
  ) {
    try {
      return await this.dealPipelineService.updatePipeline(pipelineId, payload);
    } catch (error) {
      handleError(error, RequestMethod.PUT);
    }
  }

  @Delete(':pipelineId')
  @ApiOperation({ summary: 'Removes a deal pipeline' })
  @ApiNoContentResponse({
    description: 'Deal pipeline was removed successfully',
  })
  @ApiNotFoundResponse({
    description: 'Deal pipeline Id was not found',
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async removePipeline(@Param('pipelineId') pipelineId: number) {
    try {
      return await this.dealPipelineService.removePipeline(pipelineId);
    } catch (error) {
      handleError(error, RequestMethod.DELETE);
    }
  }
}
