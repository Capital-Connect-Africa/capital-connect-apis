import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('connection-requests')
export class ConnectionRequestController {
  constructor(private connectionRequestService: ConnectionRequestService) {}
  @Post()
  @Roles(Role.Investor)
  async create(
    @Body() createConnectionRequestDto: CreateConnectionRequestDto,
  ): Promise<ConnectionRequest> {
    return this.connectionRequestService.create(createConnectionRequestDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(): Promise<ConnectionRequest[]> {
    return this.connectionRequestService.findAll();
  }

  @Get('investor/:investorProfileId')
  @Roles(Role.Investor, Role.Admin)
  async findAllByInvestorProfileId(
    @Param('investorProfileId') investorProfileId: number,
  ): Promise<ConnectionRequest[]> {
    return this.connectionRequestService.findAllByInvestorProfileId(
      +investorProfileId,
    );
  }

  @Get('company/:companyId')
  @Roles(Role.User, Role.Admin)
  async findAllByCompanyId(
    @Param('companyId') companyId: number,
  ): Promise<ConnectionRequest[]> {
    return this.connectionRequestService.findAllByCompanyId(+companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ConnectionRequest> {
    return this.connectionRequestService.findOne(id);
  }

  @Get(':investorProfileId/:companyId')
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
  async update(
    @Param('id') id: number,
    @Body() updateConnectionRequestDto: UpdateConnectionRequestDto,
  ): Promise<ConnectionRequest> {
    return this.connectionRequestService.update(id, updateConnectionRequestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.connectionRequestService.remove(id);
  }
}
