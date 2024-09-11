import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ConnectionRequestService } from './connectionRequest.service';
import { ConnectionRequest } from './entities/connectionRequest.entity';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import { UpdateConnectionRequestDto } from './dto/update-connection-request.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import throwInternalServer from '../shared/utils/exceptions.util';

@Controller('connection-requests')
export class ConnectionRequestController {
  constructor(private connectionRequestService: ConnectionRequestService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Investor)
  async create(
    @Body() createConnectionRequestDto: CreateConnectionRequestDto,
  ): Promise<ConnectionRequest> {
    return this.connectionRequestService.create(createConnectionRequestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Query('page') page: number, @Query('limit') limit: number): Promise<ConnectionRequest[]> {
    return this.connectionRequestService.findAll(page, limit);
  }

  @Get('investor/:investorProfileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Investor, Role.Admin)
  async findAllByInvestorProfileId(
    @Param('investorProfileId') investorProfileId: number,
    @Query('page') page: number, 
    @Query('limit') limit: number
  ): Promise<ConnectionRequest[]> {
    return this.connectionRequestService.findAllByInvestorProfileId(
      +investorProfileId,
      page,
      limit,
    );
  }

  @Get('company/:companyId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async findAllByCompanyId(
    @Param('companyId') companyId: number,
    @Query('page') page: number, 
    @Query('limit') limit: number
  ): Promise<ConnectionRequest[]> {
    return this.connectionRequestService.findAllByCompanyId(+companyId, page, limit);
  }

  @Put(':id/approve')
  async approveConnectionRequest(
    @Param('id') id: string,
  ): Promise<ConnectionRequest> {
    try {
      return this.connectionRequestService.approveConnectionRequest(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Put(':id/decline')
  async declineConnectionRequest(
    @Param('id') id: string,
  ): Promise<ConnectionRequest> {
    try {
      return this.connectionRequestService.declineConnectionRequest(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: number): Promise<ConnectionRequest> {
    return this.connectionRequestService.findOne(id);
  }

  @Get(':investorProfileId/:companyId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getConnectionRequest(
    @Param('investorId') investorId: number,
    @Param('companyId') companyId: number,
  ): Promise<ConnectionRequest> {
    const connectionRequest =
      await this.connectionRequestService.findConnectionRequest(
        investorId,
        companyId,
      );

    if (!connectionRequest) {
      throw new NotFoundException(
        `Connection request not found for investor ID ${investorId} and company ID ${companyId}`,
      );
    }

    return connectionRequest;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: number,
    @Body() updateConnectionRequestDto: UpdateConnectionRequestDto,
  ): Promise<ConnectionRequest> {
    return this.connectionRequestService.update(id, updateConnectionRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.connectionRequestService.remove(id);
  }
}
