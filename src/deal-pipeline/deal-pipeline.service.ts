import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from './entities/deal.entity';
import { Repository } from 'typeorm';
import { DealStage } from './entities/deal-stage.entity';
import { DealDto } from './dto/deal.dto';
import { User } from 'src/users/entities/user.entity';
import { DealCustomer } from './entities/deal-customer.entity';
import { DealStatus } from 'src/shared/enums/deal.status.enum';
import { DealStageDto } from './dto/deal-stage.dto';
import { DealCustomerDto } from './dto/deal-customer.dto';
import { DealStageHistory } from './entities/deal-stage-history.entity';
import { DealAttachment } from './entities/deal-attachments.entity';
import { Role } from 'src/auth/role.enum';
import { DealPipeline } from './entities/deal-pipeline.entity';
import { DealPipelineDto } from './dto/deal-pipeline.dto';

@Injectable()
export class DealPipelineService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(DealStage)
    private readonly dealStageRepository: Repository<DealStage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DealCustomer)
    private readonly dealCustomerRepository: Repository<DealCustomer>,
    @InjectRepository(DealStageHistory)
    private readonly dealStageHistoryRepository: Repository<DealStageHistory>,
    @InjectRepository(DealAttachment)
    private readonly dealAttachmentRepository: Repository<DealAttachment>,
    @InjectRepository(DealPipeline)
    private readonly dealPipelineRepository: Repository<DealPipeline>,
  ) {}

  private _validateUser(
    user: User | null,
    role: Role | null = null,
    errorMessages = {
      user: 'User not found',
      role: 'Invalid user role',
      kyc: 'User did not complete the kyc process',
    },
  ) {
    let message: string | null = null;
    if (!user) message = errorMessages.user;
    else if (!user.isEmailVerified || !user.hasAcceptedTerms)
      message = errorMessages.kyc;
    else if (role) {
      if (!user.roles.includes(role)) message = errorMessages.role;
    }
    return message;
  }

  async createPipeline(
    payload: DealPipelineDto,
    user: User | null = null,
  ): Promise<DealPipeline> {
    const { name, maxNumberOfStages, ownerId } = payload;
    const owner =
      user ?? (await this.userRepository.findOneBy({ id: ownerId }));
    const message = this._validateUser(owner, Role.Investor);

    if (message) throw new BadRequestException(message);
    const pipeline = this.dealPipelineRepository.create({
      name,
      maxNumberOfStages,
      owner: user,
    });

    return await this.dealPipelineRepository.save(pipeline);
  }

  async findAllUserPipelines(ownerId: number): Promise<DealPipeline[]> {
    const user = await this.userRepository.findOneBy({ id: ownerId });
    if (!user) throw new NotFoundException('User not found');
    const data = await this.dealPipelineRepository.find({
      where: { owner: { id: ownerId } },
      order: { id: 'DESC' },
    });

    if (!data.length) {
      return [await this.createPipeline({ ownerId }, user)];
    }
    return data;
  }
}
