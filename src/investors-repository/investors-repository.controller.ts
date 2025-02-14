import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileParser } from 'src/shared/utils/file-parser.util';
import { InvestorsUsersSearchHistoryDto } from './dto/investors-users-search-history.dto';

@ApiTags('investors repository')
@Controller('investors-repository')
export class InvestorsRepositoryController {
  constructor(private investorRespositoryService: InvestorsRepositoryService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Post('search')
  @ApiOperation({ summary: 'Filters investors and create a search entry' })
  @ApiCreatedResponse({
    description: 'External investors retrieved successfully',
    type: InvestorsRepository,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async searchExternalInvestors(@Body() body: InvestorsUsersSearchHistoryDto) {
    try {
      return await this.investorRespositoryService.searchExternalInvestors(
        body,
      );
    } catch (error) {
      handleError(error, RequestMethod.POST);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadInvestorsFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const { originalname, buffer } = file;
    const fileExtension = originalname.split('.').pop().toLowerCase();

    let investorsData: any[];

    try {
      if (fileExtension === 'json') {
        investorsData = JSON.parse(buffer.toString());
      } else if (fileExtension === 'csv') {
        investorsData = await FileParser.parseCSV(buffer);
      } else if (fileExtension === 'xlsx') {
        investorsData = FileParser.parseExcel(buffer);
      } else {
        throw new BadRequestException('Unsupported file format');
      }
      return await this.investorRespositoryService.bulkCreateInvestors(
        investorsData,
      );
    } catch (error) {
      throw new BadRequestException('Error processing file: ' + error.message);
    }
  }
}
