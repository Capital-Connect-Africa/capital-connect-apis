import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionRequest } from './entities/connectionRequest.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import { UpdateConnectionRequestDto } from './dto/update-connection-request.dto';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Company } from 'src/company/entities/company.entity';
import { MatchmakingService } from './matchmaking.service';
import throwInternalServer from '../shared/utils/exceptions.util';
import { BrevoService } from '../shared/brevo.service';
import { connectionApproval } from '../templates/connection-approval';
import { connectionRequest } from '../templates/connection-request';

@Injectable()
export class ConnectionRequestService {
  constructor(
    @InjectRepository(ConnectionRequest)
    private readonly connectionRequestRepository: Repository<ConnectionRequest>,
    @InjectRepository(InvestorProfile)
    private readonly investorProfileRepository: Repository<InvestorProfile>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private matchmakingService: MatchmakingService,
    private readonly brevoService: BrevoService,
  ) {}

  async create(
    createConnectionRequestDto: CreateConnectionRequestDto,
  ): Promise<ConnectionRequest> {
    const { investorProfileId, companyId } = createConnectionRequestDto;

    const investorProfile = await this.investorProfileRepository.findOneBy({
      id: investorProfileId,
    });
    if (!investorProfile) {
      throw new NotFoundException(
        `InvestorProfile with ID ${investorProfileId} not found`,
      );
    }

    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    const existingRequest = await this.connectionRequestRepository.findOne({
      where: {
        investorProfile: { id: investorProfileId },
        company: { id: companyId },
      },
    });

    try {
      await this.matchmakingService.requestToConnectWithCompany(
        investorProfileId,
        companyId,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throwInternalServer(error);
    }

    if (existingRequest) {
      return await this.connectionRequestRepository.save(existingRequest);
    } else {
      const newRequest = this.connectionRequestRepository.create({
        investorProfile,
        company,
      });
      const connectionRequest = await this.connectionRequestRepository.save(newRequest);
      this.sendConnectionRequestEmail(company.id, connectionRequest.uuid);
      return connectionRequest;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ConnectionRequest[]> {
    return this.connectionRequestRepository.find({
      relations: ['investorProfile', 'company'],
      take: limit,
      skip: (page - 1) * limit,
      order: {id: 'DESC'},
    });
  }

  async findAllByInvestorProfileId(
    investorProfileId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ConnectionRequest[]> {
    const investorProfile = await this.investorProfileRepository.findOneBy({
      id: investorProfileId,
    });
    if (!investorProfile) {
      throw new NotFoundException(
        `InvestorProfile with ID ${investorProfileId} not found`,
      );
    }

    return this.connectionRequestRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
      },
      relations: ['company'],
      take: limit,
      skip: (page - 1) * limit,
      order: {id: 'DESC'},
    });
  }

  async findAllByCompanyId(
    companyId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ConnectionRequest[]> {
    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return this.connectionRequestRepository.find({
      where: {
        company: { id: companyId },
      },
      relations: ['investorProfile'],
      take: limit,
      skip: (page - 1) * limit,
      order: {id: 'DESC'},
    });
  }

  async approveConnectionRequest(id: string) {
    const approvalRequest = await this.connectionRequestRepository.findOne({
      where: { uuid: id, isApproved: IsNull() },
      relations: ['investorProfile', 'company'],
    });
    if (!approvalRequest) {
      throw new NotFoundException(`Valid connection request with ID ${id} not found`);
    }
    await this.matchmakingService.connectWithCompany(
      approvalRequest.investorProfile.id,
      approvalRequest.company.id,
    );
    this.sendConnectionApprovalEmail(approvalRequest.company.id);
    return this.update(approvalRequest.id, { isApproved: true });
  }

  async declineConnectionRequest(id: string) {
    const approvalRequest = await this.connectionRequestRepository.findOne({
      where: { uuid: id, isApproved: IsNull()  },
      relations: ['investorProfile', 'company'],
    });
    if (!approvalRequest) {
      throw new NotFoundException(`Valid connection request with ID ${id} not found`);
    }
    await this.matchmakingService.markAsDeclined(
      approvalRequest.investorProfile.id,
      approvalRequest.company.id,
      ['Declined by business owner.'],
    );
    return this.update(approvalRequest.id, { isApproved: false });
  }

  async findOne(id: number): Promise<ConnectionRequest> {
    const connectionRequest = await this.connectionRequestRepository.findOne({
      where: { id },
      relations: ['investorProfile', 'company', 'company.user'],
    });

    if (!connectionRequest) {
      throw new NotFoundException(`Connection request with ID ${id} not found`);
    }

    return connectionRequest;
  }

  async findConnectionRequest(
    investorId: number,
    companyId: number,
  ): Promise<ConnectionRequest | null> {
    const connectionRequest = await this.connectionRequestRepository.findOne({
      where: {
        investorProfile: { id: investorId },
        company: { id: companyId },
      },
      relations: ['investorProfile', 'company'],
    });

    if (!connectionRequest) {
      console.log(
        'No connection request found for the given investor and company IDs',
      );
    }

    return connectionRequest;
  }

  async update(
    id: number,
    updateConnectionRequestDto: UpdateConnectionRequestDto,
  ): Promise<ConnectionRequest> {
    const connectionRequest = await this.connectionRequestRepository.findOneBy({
      id,
    });

    if (!connectionRequest) {
      throw new Error('Connection request not found');
    }

    const updatedConnectionRequest = Object.assign(
      connectionRequest,
      updateConnectionRequestDto,
    );

    return this.connectionRequestRepository.save(updatedConnectionRequest);
  }

  async remove(id: number): Promise<void> {
    await this.connectionRequestRepository.delete(id);
  }

  private async sendConnectionApprovalEmail(id: number) {
    const investorProfile = await this.investorProfileRepository.findOne({
      where: { id },
      relations: ['investor'],
    });

    if (!investorProfile) return;

    const msg = {
      from: process.env.FROM_EMAIL, // Use your verified sender
      subject: 'Connection Request Accepted on www.capitalconnect.africa',
      html: connectionApproval(
        `${investorProfile.investor.firstName} ${investorProfile.investor.lastName}`,
        investorProfile.organizationName,
      ),
    };
    const recipients = [
      {
        email: investorProfile.investor.username,
        name: `${investorProfile.investor.firstName} ${investorProfile.investor.lastName}`,
      },
      {
        email: 'services@capitalconnect.africa',
        name: `Capital Connect`,
      },
    ];
    await this.brevoService.sendEmailViaBrevo(msg, recipients);
  }

  private async sendConnectionRequestEmail(id: number, uuid: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!company) return;

    const msg = {
      from: process.env.FROM_EMAIL, // Use your verified sender
      subject: 'New Connection Request on www.capitalconnect.africa',
      html: connectionRequest(
        `${company.user.firstName} ${company.user.lastName}`,
        company.name,
        uuid,
      ),
    };
    const recipients = [
      {
        email: company.user.username,
        name: `${company.user.firstName} ${company.user.lastName}`,
      },
      {
        email: 'services@capitalconnect.africa',
        name: `Capital Connect`,
      },
    ];
    await this.brevoService.sendEmailViaBrevo(msg, recipients);
  }
}
