import {
  BadRequestException,
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
  ) {}
  async createDeal(
    payload: CreateDealDto,
    isInitiatorAdmin: boolean = false,
  ): Promise<Deal> {
    const { ownerId, customerId, currentStageId, name, value, status } =
      payload;

    const owner = await this.userRepository.findOneBy({ id: ownerId });
    if (!owner || !owner.hasAcceptedTerms || !owner.isEmailVerified) {
      throw new BadRequestException(
        `Unable to create deal. Ensure ${isInitiatorAdmin ? 'user has successfully completed the kyc process' : 'you successfully completed the kyc process.'} and try again`,
      );
    }
    const stage = await this.dealStageRepository.findOneBy({
      id: currentStageId,
    });
    if (!stage) {
      throw new BadRequestException(
        `Unable to create deal. Unable to determine the selected stage`,
      );
    }
    const customer = await this.dealCustomerRepository.findOneBy({
      id: customerId,
    });
    if (!customer) {
      throw new BadRequestException(
        `Unable to create deal. Unable to determin the selected customer details`,
      );
    }

    const deal = this.dealRepository.create({
      name,
      value,
      status: status ?? DealStatus.ACTIVE,
      currentStage: stage,
      owner,
      customer,
    });

    return await this.dealRepository.save(deal);
  }

  async createDealStage(
    payload: CreateDealStageDto,
    isInitiatorAdmin: boolean = false,
  ): Promise<DealStage> {
    const { name, progress, userId } = payload;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.hasAcceptedTerms || !user.isEmailVerified) {
      throw new BadRequestException(
        `Unable to create stage. Ensure ${isInitiatorAdmin ? 'user has successfully completed the kyc process' : 'you successfully completed the kyc process.'} and try again`,
      );
    }

    if (progress < 0 || progress > 100) {
      throw new BadRequestException(
        `Unable to create stage. Progress must be between 0% and 100%`,
      );
    }

    // current stage must have a higher progress than the previous one(s)
    const stages = await this.dealStageRepository.findBy({
      user: { id: userId },
    });

    const maxStagesCount = 7;

    if (stages.length) {
      // users can define upto maxStagesCount stages
      if (stages.length >= 7) {
        throw new BadRequestException(
          `Unable to create stage. You have exceeded the maximum quota of ${maxStagesCount} stages`,
        );
      }
      stages.forEach((stage) => {
        if (stage.progress > progress) {
          if (progress < 0 || progress > 100) {
            throw new BadRequestException(
              `Unable to create stage. Previous stages cannot have a higher progress value than the current stage`,
            );
          }
        }
      });
    }

    const stage = this.dealStageRepository.create({
      name,
      progress: progress > 100 ? 100 : progress < 0 ? 0 : progress,
      user,
    });

    return await this.dealStageRepository.save(stage);
  }

  async createDealCustomer(
    payload: CreateDealCustomerDto,
  ): Promise<DealCustomer> {
    const { userId, name, phone, email } = payload;
    let customer: DealCustomer | null = null;
    let newDealCustomer: Partial<DealCustomer>;
    if (name && phone && email) {
      customer = this.dealCustomerRepository.create({ name, phone, email });
      newDealCustomer = customer;
    } else if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user || !user.isEmailVerified || !user.hasAcceptedTerms) {
        throw new BadRequestException(
          `Unable to save customer details. Ensure user has successfully completed the kyc process and try again`,
        );
      }
      customer = this.dealCustomerRepository.create({ user });
      newDealCustomer = {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.username,
        phone: (user.mobileNumbers || []).at(0).phoneNo,
      };
    }
    if (!customer)
      throw new BadRequestException(
        `Unable to create customer. All customer fields must be provided`,
      );
    const savedDealCustomerDetails =
      await this.dealCustomerRepository.save(customer);
    newDealCustomer.id = savedDealCustomerDetails.id;
    newDealCustomer.deals = savedDealCustomerDetails.deals;
    return newDealCustomer as DealCustomer;
  }

  async updateDeal(
    payload: Partial<CreateDealDto>,
    dealId: number,
    isInitiatorAdmin: boolean = false,
  ): Promise<Deal> {
    const deal = await this.dealRepository.findOneBy({ id: dealId });
    if (!deal) {
      throw new NotFoundException('Deal not found. Unable to update.');
    }

    const { ownerId, customerId, currentStageId, name, value, status } =
      payload;
    const history: Partial<DealStageHistory> = {};

    // Update owner (only allowed for admins)
    if (ownerId && isInitiatorAdmin) {
      const owner = await this.userRepository.findOneBy({ id: ownerId });
      if (!owner) {
        throw new BadRequestException('New owner not found.');
      }
      if (owner.id !== deal.owner.id) {
        if (!owner.isEmailVerified || !owner.hasAcceptedTerms) {
          throw new BadRequestException('New owner must complete KYC process.');
        }
        deal.owner = owner;
      }
    }

    // Update customer
    if (customerId) {
      const customer = await this.dealCustomerRepository.findOneBy({
        id: customerId,
      });
      if (!customer) {
        throw new BadRequestException('Customer not found.');
      }
      deal.customer = customer;
    }

    // Update stage
    if (currentStageId) {
      const stage = await this.dealStageRepository.findOneBy({
        id: currentStageId,
      });
      if (!stage) {
        throw new BadRequestException('Stage not found.');
      }
      if (stage.id !== deal.currentStage.id) {
        history.toStage = stage;
        history.fromStage = deal.currentStage;
        history.valueShift = (value ?? deal.value) - deal.value;
      }
      deal.currentStage = stage; // important it stays here
    }

    // Update other fields (name, value, status)
    if (name) deal.name = name;
    if (value) deal.value = value;
    if (status) deal.status = status;

    // Save updated deal
    await this.dealRepository.update(dealId, deal);

    // Save history if stage changed
    if (history.toStage) {
      history.deal = deal;
      const dealStageHistory = this.dealStageHistoryRepository.create(history);
      await this.dealStageHistoryRepository.save(dealStageHistory);
    }

    return deal;
  }

  async updateDealStage(
    payload: Partial<CreateDealStageDto>,
    dealStageId: number,
    isInitiatorAdmin: boolean = false,
  ) {
    const { name, progress, userId } = payload;
    const stage = await this.dealStageRepository.findOneBy({ id: dealStageId });
    if (!stage) {
      throw new NotFoundException(`Stage not found. Unable to update`);
    }

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user || !user.hasAcceptedTerms || !user.isEmailVerified) {
        throw new BadRequestException(
          `Unable to create stage. Ensure ${isInitiatorAdmin ? 'user has successfully completed the kyc process' : 'you successfully completed the kyc process.'} and try again`,
        );
      }
      stage.user = user;
    }

    if (progress) {
      if (progress < 0 || progress > 100) {
        throw new BadRequestException(`Progress must be between 0% and 100%`);
      }
      stage.progress = progress;
    }

    if (name) stage.name = name;

    await this.dealStageRepository.update(dealStageId, stage);
    return stage;
  }

  async updateDealCustomer(
    payload: Partial<CreateDealCustomerDto>,
    customerId: number,
  ) {
    const customer = await this.dealCustomerRepository.findOneBy({
      id: customerId,
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found. Unable to update`);
    }

    if (customer.user) {
      throw new ForbiddenException(`Forbidden operation. Unable to update`);
    }

    const { name, email, phone } = payload;
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    await this.dealCustomerRepository.update(customerId, customer);
    return customer;
  }

  async addAttachmentToDeal(dealId: number, fileId: number) {
    const deal = await this.dealRepository.findOneBy({ id: dealId });
    if (!deal) {
      throw new NotFoundException('Deal not found. Unable to attach file');
    }

    // const attchment =await this.
    // implement logic to upload deal attachment

    const stage = deal.currentStage;
  }

  async findAllDeals(
    page: number,
    limit: number,
  ): Promise<{ data: Deal[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [deals, records_count] = await this.dealRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data: deals, total_count: records_count };
  }

  async findAllUserDeals(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [deals, records_count] = await this.dealRepository.findAndCount({
      skip,
      take: limit,
      where: { owner: { id: userId } },
      order: { id: 'DESC' },
    });
    return { data: deals, total_count: records_count };
  }

  async findOneDeal(dealId: number): Promise<Deal> {
    const deal = await this.dealRepository.findOneBy({ id: dealId });
    if (!deal) throw new NotFoundException('Deal was not found');
    return deal;
  }

  async findOneStage(stageId: number): Promise<DealStage> {
    const stage = await this.dealStageRepository.findOneBy({ id: stageId });
    if (!stage) throw new NotFoundException('Deal stage was not found');
    return stage;
  }

  async findUserStages(userId: number): Promise<DealStage[]> {
    const stages = await this.dealStageRepository.find({
      where: {
        id: userId,
      },
      relations: ['deals'],
    });

    return stages;
  }

  async findAllStages(
    page: number,
    limit: number,
  ): Promise<{ data: DealStage[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [stages, records_count] = await this.dealStageRepository.findAndCount(
      {
        skip,
        take: limit,
        relations: ['deals'],
        order: { id: 'DESC' },
      },
    );

    return { data: stages, total_count: records_count };
  }

  async findDealHistory(
    dealId: number,
    page: number,
    limit: number,
  ): Promise<{ data: DealStageHistory[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [history, records_count] =
      await this.dealStageHistoryRepository.findAndCount({
        skip,
        take: limit,
        where: {
          deal: { id: dealId },
        },
        relations: ['deals'],
      });
    return { data: history, total_count: records_count };
  }

  async removeDeal(dealId: number) {
    const deal = await this.dealRepository.findOneBy({
      id: dealId,
    });
    if (!deal) throw new NotFoundException('Deal not found. Unable to remove');
    await this.dealRepository.remove(deal);
    return;
  }

  async removeDealStage(stageId: number) {
    const stage = await this.dealStageRepository.findOneBy({
      id: stageId,
    });
    if (!stage)
      throw new NotFoundException('Stage not found. Unable to remove');
    await this.dealStageRepository.remove(stage);
    return;
  }

  async removeDealCustomer(customerId: number) {
    const customer = await this.dealCustomerRepository.findOneBy({
      id: customerId,
    });
    if (!customer)
      throw new NotFoundException('Customer not found. Unable to remove');
    await this.dealCustomerRepository.remove(customer);
    return;
  }
}
