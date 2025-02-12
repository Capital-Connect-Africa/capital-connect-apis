import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvestorRepositoryDto } from './dto/investor-repository.dto';
import { InvestorsRepository } from './entities/investors-repository.entity';
import { InvestorType } from 'src/investor-types/entities/investor-type.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { SubSector } from 'src/subsector/entities/subsector.entity';
import { InvestorRespostoryInvestees } from './entities/investor-repository-investees.entity';
import { Country } from 'src/country/entities/country.entity';
import { EsgFocusAreas } from 'src/esg-focus/entities/esg-focus-areas.entity';
import { Stage } from 'src/stage/entities/stage.entity';

@Injectable()
export class InvestorsRepositoryService {
  constructor(
    @InjectRepository(InvestorsRepository)
    private readonly investorsRepository: Repository<InvestorsRepository>,
    @InjectRepository(InvestorType)
    private readonly investorTypeRepository: Repository<InvestorType>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
    @InjectRepository(SubSector)
    private readonly subSectorRepository: Repository<SubSector>,
    @InjectRepository(InvestorRespostoryInvestees)
    private readonly investorRespostoryInvesteesRepository: Repository<InvestorRespostoryInvestees>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(EsgFocusAreas)
    private readonly esgRepository: Repository<EsgFocusAreas>,
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,
  ) {}
  async createInvestor(
    payload: InvestorRepositoryDto,
  ): Promise<InvestorsRepository> {
    const {
      sectors,
      subsectors,
      website,
      name,
      typeId,
      countries,
      investees,
      esgFocusAreas,
      minFunding,
      maxFunding,
      businessGrowthStages,
      description,
    } = payload;

    if (!name.trim())
      throw new BadRequestException('investor name is required');
    if (!minFunding)
      throw new BadRequestException('investors minimum funding required');
    if (!maxFunding)
      throw new BadRequestException('investors maximum funding required');
    if (!typeId) throw new BadRequestException('investors type required');

    if (await this.investorsRepository.findOneBy({ name: name }))
      throw new ConflictException('Investor with name already exists');

    const newExternalInvestor: Partial<InvestorsRepository> = {
      name,
      minFunding,
      maxFunding,
      website,
      description,
    };
    if (minFunding > maxFunding) {
      newExternalInvestor.minFunding = maxFunding;
      newExternalInvestor.maxFunding = minFunding;
    }
    const type = await this.investorTypeRepository.findOneBy({ id: typeId });
    if (!type) throw new BadRequestException('Unsupported investor type');
    newExternalInvestor.type = type;

    if (countries) {
      newExternalInvestor.countries = (
        await this.countryRepository.find({
          where: {
            name: In(countries),
          },
        })
      ).map((country) => country.name);
    }

    if (esgFocusAreas) {
      newExternalInvestor.esgFocusAreas = (
        await this.esgRepository.find({
          where: {
            title: In(esgFocusAreas),
          },
        })
      ).map((esg) => esg.title);
    }

    if (businessGrowthStages) {
      newExternalInvestor.businessGrowthStages = (
        await this.stageRepository.find({
          where: {
            title: In(businessGrowthStages),
          },
        })
      ).map((stage) => stage.title);
    }

    if (sectors) {
      newExternalInvestor.sectors = await this.sectorRepository.find({
        where: {
          id: In(sectors),
        },
      });
    }

    if (subsectors) {
      newExternalInvestor.subSectors = await this.subSectorRepository.find({
        where: {
          id: In(subsectors),
        },
      });
    }

    if (investees) {
      newExternalInvestor.investees =
        await this.investorRespostoryInvesteesRepository.find({
          where: {
            id: In(investees),
          },
        });
    }

    const externalInvestor =
      this.investorsRepository.create(newExternalInvestor);
    return await this.investorsRepository.save(externalInvestor);
  }

  async createManyInvestors() {}

  async getInvestors(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: InvestorsRepository[]; total_count: number }> {
    const skip = (page - 1) * limit;
    const [data, total_count] = await this.investorsRepository.findAndCount({
      skip,
      take: limit,
    });
    return { data, total_count };
  }

  async getInvestor(investorId: number): Promise<InvestorsRepository> {
    const investor = await this.investorsRepository.findOne({
      where: {
        id: investorId,
      },
    });
    if (!investor) throw new NotFoundException(`Investor with not found`);
    return investor;
  }

  async updateInvestor(
    investorId: number,
    payload: Partial<InvestorRepositoryDto>,
  ): Promise<InvestorsRepository> {
    const investor = await this.investorsRepository.findOne({
      where: {
        id: investorId,
      },
    });
    if (!investor) throw new NotFoundException(`Investor with not found`);
    const {
      sectors,
      subsectors,
      website,
      name,
      typeId,
      countries,
      investees,
      esgFocusAreas,
      minFunding,
      maxFunding,
      currency,
    } = payload;

    if (name) investor.name = name;
    if (countries) investor.countries = countries;
    if (currency) investor.currency = currency;
    if (website) investor.website = website;
    if (minFunding) investor.minFunding = minFunding;
    if (maxFunding) investor.maxFunding = maxFunding;
    if (esgFocusAreas) investor.esgFocusAreas = esgFocusAreas;
    if (typeId) {
      const type = await this.investorTypeRepository.findOneBy({ id: typeId });
      if (!type) throw new BadRequestException('Unsupported investor type');
      investor.type = type;
    }

    if (sectors) {
      investor.sectors = await this.sectorRepository.find({
        where: {
          id: In(sectors),
        },
      });
    }

    if (subsectors) {
      investor.subSectors = await this.subSectorRepository.find({
        where: {
          id: In(subsectors),
        },
      });
    }

    if (investees) {
      investor.investees =
        await this.investorRespostoryInvesteesRepository.find({
          where: {
            id: In(investees),
          },
        });
    }
    await this.investorsRepository.update(investorId, investor);
    return investor;
  }

  async removeInvestor(investorId: number): Promise<void> {
    const investor = await this.investorsRepository.findOne({
      where: {
        id: investorId,
      },
    });
    if (!investor) throw new NotFoundException(`Investor with not found`);
    await this.investorsRepository.remove(investor);
  }
}
