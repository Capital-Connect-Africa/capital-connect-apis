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
import { CreateDealDto } from './dto/create-deal.dto';
import { Deal } from './entities/deal.entity';
import { CreateDealStageDto } from './dto/create-deal-stage.dto';
import { DealStage } from './entities/deal-stage.entity';
import { CreateDealCustomerDto } from './dto/create-deal-customer.dto';

// deal-pipeline/ url is preserved to be used for getting pipelines
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Investor)
@ApiTags('Deal Pipeline')
@Controller('deal-pipeline')
export class DealPipelineController {
  constructor(private dealPipelineService: DealPipelineService) {}
}
