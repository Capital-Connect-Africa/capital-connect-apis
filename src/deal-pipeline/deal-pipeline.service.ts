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
import { CreateDealDto } from './dto/create-deal.dto';
import { User } from 'src/users/entities/user.entity';
import { DealCustomer } from './entities/deal-customer.entity';
import { DealStatus } from 'src/shared/enums/deal.status.enum';
import { CreateDealStageDto } from './dto/create-deal-stage.dto';
import { CreateDealCustomerDto } from './dto/create-deal-customer.dto';
import { DealStageHistory } from './entities/deal-stage-history.entity';
import { DealAttachment } from './entities/deal-attachments.entity';
import { Role } from 'src/auth/role.enum';
import { DealPipeline } from './entities/deal-pipeline.entity';

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
}
