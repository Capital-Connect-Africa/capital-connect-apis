import { Injectable, NotFoundException } from "@nestjs/common";
import { ConnectionRequest } from "./entities/connectionRequest.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateConnectionRequestDto } from "./dto/create-connection-request.dto";
import { UpdateConnectionRequestDto } from "./dto/update-connection-request.dto";
import { InvestorProfile } from "src/investor-profile/entities/investor-profile.entity";
import { Company } from "src/company/entities/company.entity";

@Injectable()
export class ConnectionRequestService {
  constructor(
    @InjectRepository(ConnectionRequest)
    private readonly connectionRequestRepository: Repository<ConnectionRequest>,
    @InjectRepository(InvestorProfile)
    private readonly investorProfileRepository: Repository<InvestorProfile>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

    async create(createConnectionRequestDto: CreateConnectionRequestDto): Promise<ConnectionRequest> {
        const { investorProfileId, companyId } = createConnectionRequestDto;

        const investorProfile = await this.investorProfileRepository.findOneBy({ id: investorProfileId });
        if (!investorProfile) {
        throw new NotFoundException(`InvestorProfile with ID ${investorProfileId} not found`);
        }

        const company = await this.companyRepository.findOneBy({ id: companyId });
        if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        // Check if connection request already exists
        const existingRequest = await this.connectionRequestRepository.findOne({
        where: {
            investorProfile: { id: investorProfileId },
            company: { id: companyId },
        },
        });

        if (existingRequest) {
        // If it exists, update and save
        existingRequest.isApproved = createConnectionRequestDto.isApproved ?? existingRequest.isApproved;
        return this.connectionRequestRepository.save(existingRequest);
        } else {
        // If it doesn't exist, create and save a new one
        const newRequest = this.connectionRequestRepository.create({
            investorProfile,
            company,
            isApproved: createConnectionRequestDto.isApproved ?? false,
        });

        return this.connectionRequestRepository.save(newRequest);
        }
    }  
    
    async findAll(): Promise<ConnectionRequest[]> {
        return this.connectionRequestRepository.find({
            relations: ['investorProfile', 'company']
        });
    }

    async findAllByInvestorProfileId(investorProfileId: number): Promise<ConnectionRequest[]> {
        const investorProfile = await this.investorProfileRepository.findOneBy({ id: investorProfileId });
        if (!investorProfile) {
          throw new NotFoundException(`InvestorProfile with ID ${investorProfileId} not found`);
        }
    
        // Find all connection requests for the given investor profile ID
        return this.connectionRequestRepository.find({
          where: {
            investorProfile: { id: investorProfileId },
          },
          relations: ['company'],
        });
      }

      async findAllByCompanyId(companyId: number): Promise<ConnectionRequest[]> {
        const company = await this.companyRepository.findOneBy({ id: companyId });
        if (!company) {
          throw new NotFoundException(`Company with ID ${companyId} not found`);
        }
    
        // Find all connection requests for the given company ID
        return this.connectionRequestRepository.find({
          where: {
            company: { id: companyId },
          },
          relations: ['investorProfile'], // Optionally include relations if needed
        });
      }
    
      async findOne(id: number): Promise<ConnectionRequest> {
        const connectionRequest = await this.connectionRequestRepository.findOne({
          where: { id },
          relations: ['investorProfile', 'company']
        });
    
        if (!connectionRequest) {
          throw new NotFoundException(`ConnectionRequest with ID ${id} not found`);
        }
    
        return connectionRequest;
      }

      async findConnectionRequest(investorId: number, companyId: number): Promise<ConnectionRequest | null> {
        const connectionRequest = await this.connectionRequestRepository.findOne({
          where: {
            investorProfile: { id: investorId },
            company: { id: companyId },
          },
          relations: ['investorProfile', 'company'],
        });
    
        if (!connectionRequest) {
          console.log('No connection request found for the given investor and company IDs');
        }
    
        return connectionRequest;
    }    
    
    async update(id: number, updateConnectionRequestDto: UpdateConnectionRequestDto): Promise<ConnectionRequest> {
        const connectionRequest = await this.connectionRequestRepository.findOneBy({ id });
        
        if (!connectionRequest) {
          throw new Error('Connection request not found');
        }
    
        const updatedConnectionRequest = Object.assign(connectionRequest, updateConnectionRequestDto);
    
        return this.connectionRequestRepository.save(updatedConnectionRequest);
      }
    
    async remove(id: number): Promise<void> {
        await this.connectionRequestRepository.delete(id);
    }
}