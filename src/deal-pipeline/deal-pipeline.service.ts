import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from './entities/deal.entity';
import { ILike, Repository } from 'typeorm';
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
import { textToTitlteCase } from 'src/shared/helpers/text-to-title-case';

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

  /* ===============Deal Pipeline=============== */
  async createPipeline(
    payload: DealPipelineDto,
    user: User | null = null,
  ): Promise<DealPipeline> {
    const { name, maxNumberOfStages, ownerId } = payload;
    const owner =
      user ?? (await this.userRepository.findOneBy({ id: ownerId }));
    const message = this._validateUser(owner, Role.Investor);

    if (message) throw new BadRequestException(message);
    const pipelines = await this.dealPipelineRepository.find({
      where: {
        owner: { id: ownerId },
      },
    });

    if ([name, maxNumberOfStages].filter((v) => !v).length) {
      throw new BadRequestException('All fields are required*');
    }

    const pipelineName = textToTitlteCase(name);

    if (
      pipelines
        .map((pipeline) => textToTitlteCase(pipeline.name))
        .includes(pipelineName)
    ) {
      throw new ConflictException(
        `Pipeline with name '${name}' already exists`,
      );
    }

    const pipeline = this.dealPipelineRepository.create({
      name: pipelineName,
      maxNumberOfStages,
      owner,
    });

    return await this.dealPipelineRepository.save(pipeline);
  }

  async findAllUserPipelines(ownerId: number): Promise<DealPipeline[]> {
    const user = await this.userRepository.findOneBy({ id: ownerId });
    if (!user) throw new NotFoundException('User not found');
    const data = await this.dealPipelineRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['stages', 'stages.deals'],
      order: { id: 'DESC', stages: { progress: 'ASC' } },
    });

    if (!data.length) {
      return [await this.createPipeline({ ownerId }, user)];
    }
    return data;
  }

  async findOnePipeline(pipelineId: number): Promise<DealPipeline> {
    const pipeline = await this.dealPipelineRepository.findOne({
      where: { id: pipelineId },
      relations: ['owner', 'stages', 'stages.deals'],
      order: { stages: { progress: 'ASC' } },
    });
    if (!pipeline) throw new NotFoundException(`Deal pipeline not found`);
    return pipeline;
  }

  async updatePipeline(
    pipelineId: number,
    payload: Partial<DealPipelineDto>,
  ): Promise<DealPipeline> {
    const pipeline = await this.dealPipelineRepository.findOne({
      where: { id: pipelineId },
    });
    if (!pipeline) throw new NotFoundException(`Deal pipeline not found`);
    const { name, maxNumberOfStages } = payload;
    if (name) pipeline.name = name;
    if (maxNumberOfStages) pipeline.maxNumberOfStages = maxNumberOfStages;
    await this.dealPipelineRepository.update(pipelineId, pipeline);
    return pipeline;
  }

  async removePipeline(pipelineId: number): Promise<void> {
    const pipeline = await this.dealPipelineRepository.findOne({
      where: { id: pipelineId },
    });
    if (!pipeline) throw new NotFoundException(`Deal pipeline not found`);
    await this.dealPipelineRepository.remove(pipeline);
    return;
  }

  /* ================Deal Stages========================== */
  async createDealStage(payload: DealStageDto): Promise<DealStage> {
    const { name, progress, pipelineId } = payload;

    if (progress < 0 || progress > 100) {
      throw new BadRequestException(
        `Unable to create stage. Stage progress must between 0% and 100%`,
      );
    }

    const pipeline = await this.dealPipelineRepository.findOne({
      where: { id: pipelineId },
      relations: ['stages'],
    });

    if (!pipeline) {
      throw new BadRequestException('Unknown pipeline. Unable to add stage');
    }
    const stages = pipeline.stages;

    if (
      stages
        .map((stage) => stage.name.toLowerCase().trim())
        .includes(name.toLowerCase().trim())
    ) {
      throw new ConflictException(
        `Stage by name '${name}' already exists in the pipeline. Unable to add`,
      );
    }

    // users can define upto maxStagesCount stages
    if (stages.length >= pipeline.maxNumberOfStages) {
      throw new BadRequestException(
        `Unable to create stage. You have exceeded the maximum quota of ${pipeline.maxNumberOfStages} stages`,
      );
    }

    const stage = this.dealStageRepository.create({
      name: name.trim(),
      progress,
      pipeline,
    });

    return await this.dealStageRepository.save(stage);
  }

  async findAllStages(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: DealStage[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [stages, records_count] = await this.dealStageRepository.findAndCount(
      {
        skip,
        take: limit,
        relations: ['pipeline', 'deals'],
        order: { id: 'DESC' },
      },
    );

    return { data: stages, total_count: records_count };
  }

  async findAllUserStages(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: DealStage[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [stages, records_count] = await this.dealStageRepository.findAndCount(
      {
        skip,
        take: limit,
        where: {
          pipeline: {
            owner: { id: userId },
          },
        },
        relations: ['pipeline', 'deals'],
        order: { id: 'DESC' },
      },
    );

    return { data: stages, total_count: records_count };
  }

  async findOneStage(stageId: number): Promise<DealStage> {
    const stage = await this.dealStageRepository.findOne({
      where: { id: stageId },
      relations: ['pipeline', 'deals'],
    });
    if (!stage) throw new NotFoundException('Deal stage was not found');
    return stage;
  }

  async updateDealStage(payload: Partial<DealStageDto>, dealStageId: number) {
    const { name, progress } = payload;
    const stage = await this.dealStageRepository.findOne({
      where: { id: dealStageId },
      relations: ['pipeline', 'pipeline.stages'],
    });
    if (!stage) {
      throw new NotFoundException(`Stage not found. Unable to update`);
    }

    if (progress) {
      if (progress < 0 || progress > 100) {
        throw new BadRequestException(`Progress must be between 0% and 100%`);
      }
      stage.progress = progress;
    }

    if (name) {
      const stages = stage.pipeline.stages;
      if (
        stages
          .map((stage) => stage.name.toLowerCase().trim())
          .includes(name.toLowerCase().trim())
      ) {
        throw new ConflictException(
          `Stage by name '${name}' already exists in the pipeline. Unable to update`,
        );
      }
      stage.name = name;
    }
    delete stage.pipeline;
    await this.dealStageRepository.update(dealStageId, stage);
    return stage;
  }

  async removeDealStage(stageId: number) {
    const stage = await this.dealStageRepository.findOneBy({
      id: stageId,
    });
    if (!stage) {
      throw new NotFoundException('Stage not found. Unable to remove');
    }
    await this.dealStageRepository.remove(stage);
    return;
  }

  /* ================Deal Customer========================== */
  async createDealCustomer(payload: DealCustomerDto): Promise<DealCustomer> {
    const { userId, name, phone, email } = payload;
    let customer: DealCustomer | null = null;
    let newDealCustomer: Partial<DealCustomer>;
    if (name && phone && email) {
      customer = await this.dealCustomerRepository.findOneBy({
        name,
        email,
        phone,
      });

      if (!customer) {
        customer = await this.dealCustomerRepository.findOne({
          where: [{ name }, { email }, { phone }],
        });
        if (customer) {
          if (customer.name == name) {
            throw new ConflictException(
              `User with name '${name}' already exists`,
            );
          }
          if (customer.email == email) {
            throw new ConflictException(
              `User with email '${email}' already exists`,
            );
          }
          if (customer.phone == phone) {
            throw new ConflictException(
              `User with phone number '${phone}' already exists`,
            );
          }
        }
      }
      customer =
        customer ?? this.dealCustomerRepository.create({ name, phone, email });
      newDealCustomer = customer;
    } else if (userId) {
      let userFound = await this.dealCustomerRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      const user =
        (userFound && userFound.user) ??
        (await this.userRepository.findOneBy({ id: userId }));
      if (!user) {
        throw new BadRequestException(`User was not found. Unable to proceed`);
      }
      const message = this._validateUser(user);
      if (message) {
        throw new BadRequestException(message);
      }
      customer = userFound || this.dealCustomerRepository.create({ user });
      const userPhoneNumber = (user.mobileNumbers || []).at(0);
      newDealCustomer = {
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.username,
        phone: userPhoneNumber ? userPhoneNumber.phoneNo : '',
      };
    }
    if (!customer)
      throw new BadRequestException(`All customer fields are required*`);
    const savedDealCustomerDetails =
      await this.dealCustomerRepository.save(customer);
    newDealCustomer.id = savedDealCustomerDetails.id;
    newDealCustomer.deals = savedDealCustomerDetails.deals;
    return newDealCustomer as DealCustomer;
  }

  async updateDealCustomer(
    payload: Partial<DealCustomerDto>,
    customerId: number,
  ) {
    const customer = await this.dealCustomerRepository.findOne({
      where: { id: customerId },
      relations: ['user'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found. Unable to update`);
    }

    if (customer.user) {
      throw new ForbiddenException(`Forbidden operation. Unable to update`);
    }

    const { name, email, phone } = payload;
    const existingCustomer = await this.dealCustomerRepository.findOne({
      where: [{ name }, { email }, { phone }],
    });

    if (name) {
      if (existingCustomer?.name == name) {
        throw new ConflictException(`User with name '${name}' already exists`);
      }
      customer.name = name;
    }
    if (email) {
      if (existingCustomer?.email == email) {
        throw new ConflictException(
          `User with email '${email}' already exists`,
        );
      }
      customer.email = email;
    }
    if (phone) {
      if (existingCustomer?.phone == phone) {
        throw new ConflictException(
          `User with phone number '${phone}' already exists`,
        );
      }
      customer.phone = phone;
    }

    await this.dealCustomerRepository.update(customerId, customer);
    return customer;
  }

  async searchDealCustomers(q: string) {
    const customers = await this.dealCustomerRepository.find({
      where: [
        { name: ILike(`%${q}%`) },
        { phone: ILike(`%${q}%`) },
        { email: ILike(`%${q}%`) },
        { user: { firstName: ILike(`%${q}%`) } },
        { user: { lastName: ILike(`%${q}%`) } },
        { user: { username: ILike(`%${q}%`) } },
      ],
      relations: ['user'],
    });

    return customers
      .map((customer) => {
        return (
          customer.name ??
          (customer.user
            ? `${customer.user.firstName ?? ''} ${customer.user.lastName ?? ''}`.trim()
            : null)
        );
      })
      .filter((name) => name)
      .map((name) => textToTitlteCase(name));
  }

  async removeDealCustomer(customerId: number) {
    const customer = await this.dealCustomerRepository.findOneBy({
      id: customerId,
    });
    if (!customer) {
      throw new NotFoundException(`Customer not found. Unable to remove`);
    }
    await this.dealCustomerRepository.remove(customer);
    return;
  }

  /* ================Deal========================== */
  async createDeal(payload: DealDto): Promise<Deal> {
    const { customerId, stageId, name, value, status } = payload;
    const stage = await this.dealStageRepository.findOne({
      where: {
        id: stageId,
      },
      relations: ['deals'],
    });

    if (!stage) {
      throw new BadRequestException(`Stage not found. Unable to create deal`);
    }

    const customer = await this.dealCustomerRepository.findOne({
      where: { id: customerId },
      relations: ['user'],
    });

    if (!customer) {
      throw new BadRequestException(
        `Customer not found. Unable to create deal.`,
      );
    }

    const deals = stage.deals;

    if (
      deals
        .map((deal) => deal.name.toLowerCase().trim())
        .includes(name.toLowerCase().trim())
    ) {
      throw new BadRequestException(`Deal with name '${name}' already exists`);
    }

    let deal = this.dealRepository.create({
      name,
      value,
      status: status ?? DealStatus.ACTIVE,
      stage: stage,
      customer,
    });

    deal = await this.dealRepository.save(deal);
    if (customer.user) {
      const user = customer.user;
      const userPhoneNumber = (user.mobileNumbers || []).at(0);
      deal.customer = {
        ...deal.customer,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.username,
        phone: userPhoneNumber ? userPhoneNumber.phoneNo : '',
      };
    }
    return deal;
  }

  async updateDeal(payload: Partial<DealDto>, dealId: number): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId },
      relations: ['stage', 'stage.deals'],
    });
    if (!deal) {
      throw new NotFoundException('Deal not found. Unable to update.');
    }

    const { customerId, stageId, name, value, status, closureDate } = payload;
    const history: Partial<DealStageHistory> = {};

    // Update deal customer
    if (customerId) {
      const customer = await this.dealCustomerRepository.findOneBy({
        id: customerId,
      });
      if (!customer) {
        throw new BadRequestException('Customer not found.');
      }
      deal.customer = customer;
    }

    // advance deal stage
    if (stageId) {
      const stage = await this.dealStageRepository.findOneBy({
        id: stageId,
      });
      if (!stage) {
        throw new BadRequestException('Stage not found. Unable to update');
      }
      if (stageId !== deal.stage.id) {
        history.toStage = stage;
        history.fromStage = deal.stage;
        history.valueShift = (value ?? deal.value) - deal.value;
      }
      deal.stage = stage;
    }

    // Update other fields (name, value, status)
    if (name) {
      const deals = deal.stage.deals;
      if (
        deals
          .map((deal) => deal.name.toLowerCase().trim())
          .includes(name.toLowerCase().trim())
      ) {
        throw new BadRequestException(
          `Deal with name '${name}' already exists`,
        );
      }
      deal.name = name;
    }
    if (closureDate) deal.closedAt = closureDate;
    if (value) {
      if (!stageId || stageId === deal.stage.id) {
        const currentDealHistoryLog =
          await this.dealStageHistoryRepository.find({
            where: {
              deal: { id: dealId },
              toStage: { id: deal.stage.id },
            },
            order: { id: 'DESC' },
          });
        if (currentDealHistoryLog.length) {
          const dealHistory = currentDealHistoryLog.at(0);
          dealHistory.valueShift = value - deal.value;
          await this.dealStageHistoryRepository.update(
            dealHistory.id,
            dealHistory,
          );
        }
      }
      deal.value = value;
    }
    if (status) {
      deal.status = status;
      if (status !== DealStatus.ACTIVE) {
        deal.closedAt = new Date();
      } else {
        deal.closedAt = null;
      }
    }

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

  async findAllDeals(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Deal[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [deals, records_count] = await this.dealRepository.findAndCount({
      skip,
      take: limit,
      relations: ['stage', 'customer', 'customer.user'],
      order: { id: 'DESC' },
    });
    return { data: deals, total_count: records_count };
  }

  async findAllUserDeals(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [deals, records_count] = await this.dealRepository.findAndCount({
      skip,
      take: limit,
      relations: ['stage', 'customer', 'customer.user'],
      where: {
        stage: {
          pipeline: {
            owner: {
              id: userId,
            },
          },
        },
      },
      order: { id: 'DESC' },
    });
    return { data: deals, total_count: records_count };
  }

  async findOneDeal(dealId: number): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id: dealId },
      relations: [
        'stage',
        'stage.pipeline',
        'stage.pipeline.owner',
        'history',
        'history.attachments',
      ],
    });
    if (!deal) throw new NotFoundException('Deal was not found');
    return deal;
  }

  async removeDeal(dealId: number) {
    const deal = await this.dealRepository.findOneBy({
      id: dealId,
    });
    if (!deal) throw new NotFoundException('Deal not found. Unable to remove');
    await this.dealRepository.remove(deal);
    return;
  }
}
