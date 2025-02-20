import {
  Repository,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  ArrayContains,
} from 'typeorm';
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
import { Country } from 'src/country/entities/country.entity';
import { EsgFocusAreas } from 'src/esg-focus/entities/esg-focus-areas.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { isValidURL } from 'src/shared/helpers/validate-http-url.helper';
import { textToTitlteCase } from 'src/shared/helpers/text-to-title-case';
import { InvestorsUsersSearchHistoryDto } from './dto/investors-users-search-history.dto';
import { InvestmentStructure } from 'src/investment-structures/entities/investment-structure.entity';
import { UseOfFunds } from 'src/use-of-funds/entities/use-of-funds.entity';
import { InvestorsRepositorySearchHistory } from './entities/investors-respository-search-history.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InvestorsRepositoryService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(InvestorsRepository)
    private readonly investorsRepository: Repository<InvestorsRepository>,
    @InjectRepository(InvestorType)
    private readonly investorTypeRepository: Repository<InvestorType>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
    @InjectRepository(SubSector)
    private readonly subSectorRepository: Repository<SubSector>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(EsgFocusAreas)
    private readonly esgRepository: Repository<EsgFocusAreas>,
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,
    @InjectRepository(InvestorsRepositorySearchHistory)
    private readonly userSearchRepository: Repository<InvestorsRepositorySearchHistory>,
    @InjectRepository(InvestmentStructure)
    private readonly investmentStructureRespository: Repository<InvestmentStructure>,
    @InjectRepository(UseOfFunds)
    private readonly useOfFundsRespository: Repository<UseOfFunds>,
  ) {}

  textToArray(text: string | string[]) {
    return typeof text === 'string'
      ? `${text}`.split(',').map((str) => str.trim())
      : text;
  }

  private async normalizePayload(payload: Partial<InvestorRepositoryDto>) {
    const {
      sectors,
      subSectors,
      countries,
      esgFocusAreas,
      businessGrowthStages,
      useOfFunds,
      investmentStructures,
      investees,
      investorType,
      website,
      name,
      contactEmail,
      contactName,
      description,
      fundingVehicle,
      minFunding,
      maxFunding,
      currency,
    } = payload;
    const validInfo: Partial<InvestorsRepository> = {};

    if (countries) {
      validInfo.countries = (
        await this.countryRepository.find({
          where: {
            name: In(this.textToArray(countries)),
          },
        })
      ).map((country) => country.name);
    }

    if (esgFocusAreas) {
      validInfo.esgFocusAreas = (
        await this.esgRepository.find({
          where: {
            title: In(this.textToArray(esgFocusAreas)),
          },
        })
      ).map((esg) => esg.title);
    }

    if (businessGrowthStages) {
      validInfo.businessGrowthStages = (
        await this.stageRepository.find({
          where: {
            title: In(this.textToArray(businessGrowthStages)),
          },
        })
      ).map((stage) => stage.title);
    }

    if (sectors) {
      validInfo.sectors = (
        await this.sectorRepository.find({
          where: {
            name: In(this.textToArray(sectors)),
          },
        })
      ).map((sector) => sector.name);
    }

    if (subSectors) {
      validInfo.subSectors = (
        await this.subSectorRepository.find({
          where: {
            name: In(this.textToArray(subSectors)),
          },
        })
      ).map((subSector) => subSector.name);
    }

    if (useOfFunds) {
      validInfo.useOfFunds = (
        await this.useOfFundsRespository.find({
          where: {
            title: In(this.textToArray(useOfFunds)),
          },
        })
      ).map((useOfFund) => useOfFund.title);
    }

    if (investmentStructures) {
      validInfo.investmentStructures = (
        await this.investmentStructureRespository.find({
          where: {
            title: In(this.textToArray(investmentStructures)),
          },
        })
      ).map((structure) => structure.title);
    }

    if (investees) {
      validInfo.investees = this.textToArray(investees).map((investee) =>
        textToTitlteCase(investee),
      );
    }

    if (investorType) {
      const type = await this.investorTypeRepository.findOneBy({
        title: investorType.trim(),
      });
      if (!type) throw new BadRequestException('Unsupported investor type');
      validInfo.type = type.title;
    }

    if (website) {
      if (!isValidURL(website.toLowerCase()))
        throw new BadRequestException(`invalid url '${website}'`);
      validInfo.website = website.toLowerCase();
    }

    if (name) validInfo.name = textToTitlteCase(name);
    if (contactName) validInfo.contactName = textToTitlteCase(contactName);
    if (contactEmail) validInfo.contactEmail = `${contactEmail}`.toLowerCase();
    if (currency) validInfo.currency = currency;
    if (description) validInfo.description = description;
    if (fundingVehicle) validInfo.fundingVehicle = fundingVehicle;
    if (minFunding) validInfo.minFunding = minFunding;
    if (maxFunding) validInfo.maxFunding = maxFunding;
    return validInfo;
  }

  async createInvestor(
    payload: InvestorRepositoryDto,
  ): Promise<InvestorsRepository> {
    const { name, investorType, minFunding, maxFunding } = payload;

    if (!name.trim())
      throw new BadRequestException('investor name is required');
    if (!minFunding)
      throw new BadRequestException('investors minimum funding required');
    if (!maxFunding)
      throw new BadRequestException('investors maximum funding required');

    if (!investorType) throw new BadRequestException('investors type required');
    if (
      await this.investorsRepository.findOneBy({ name: textToTitlteCase(name) })
    )
      throw new ConflictException('Investor with name already exists');

    const newExternalInvestor = await this.normalizePayload(payload);
    const externalInvestor = this.investorsRepository.create({
      ...newExternalInvestor,
      sectors: newExternalInvestor.sectors ?? [],
      subSectors: newExternalInvestor.subSectors ?? [],
      useOfFunds: newExternalInvestor.useOfFunds ?? [],
      investees: newExternalInvestor.investees ?? [],
      countries: newExternalInvestor.countries ?? [],
      investmentStructures: newExternalInvestor.investmentStructures ?? [],
      businessGrowthStages: newExternalInvestor.businessGrowthStages ?? [],
      esgFocusAreas: newExternalInvestor.esgFocusAreas ?? [],
    });
    return await this.investorsRepository.save(externalInvestor);
  }

  async bulkCreateInvestors(investorsData: InvestorRepositoryDto[]) {
    if (!Array.isArray(investorsData) || investorsData.length === 0) {
      throw new BadRequestException('Invalid investors data');
    }

    const savedInvestors = [];
    const failedInvestors = [];
    for (const investorData of investorsData) {
      try {
        const savedInvestor = await this.createInvestor(investorData);
        savedInvestors.push(savedInvestor);
      } catch (error) {
        failedInvestors.push({ investorData, error: error.message });
      }
    }

    return {
      message: 'Operation completed',
      savedCount: savedInvestors.length,
      failedCount: failedInvestors.length,
      failedInvestors,
      savedInvestors,
    };
  }

  async getInvestors(): Promise<InvestorsRepository[]> {
    return await this.investorsRepository.find();
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
    let investor = await this.investorsRepository.findOne({
      where: {
        id: investorId,
      },
    });
    if (!investor) throw new NotFoundException(`Investor with id not found`);
    const { minFunding, maxFunding } = payload;
    const min_funding = minFunding ?? investor.minFunding;
    const max_funding = maxFunding ?? investor.maxFunding;
    if (min_funding && max_funding && min_funding > max_funding) {
      investor.minFunding = max_funding;
      investor.maxFunding = min_funding;
    }
    investor = { ...investor, ...(await this.normalizePayload(payload)) };
    await this.investorsRepository.save(investor);
    return investor;
  }

  async removeInvestor(investorId: number): Promise<void> {
    const investor = await this.investorsRepository.findOne({
      where: {
        id: investorId,
      },
    });
    if (!investor)
      throw new NotFoundException(`Investor with id ${investorId} not found`);
    await this.investorsRepository.delete(investorId);
  }

  async searchExternalInvestors(payload: InvestorsUsersSearchHistoryDto) {
    const { query } = payload;
    const { sector, subSector, country, targetAmount, useOfFunds } =
      (query && this.jwtService.decode(query)) ?? payload;
    if (!sector && !subSector && !useOfFunds && !targetAmount && !country)
      throw new NotFoundException('could not find search criteria');

    const q = this.jwtService.sign(
      {
        sector,
        subSector,
        country,
        targetAmount,
        useOfFunds,
      },
      { secret: process.env.JWT_SECRET },
    );
    const where: any = {};
    if (country) where.countries = ArrayContains([country]);
    if (sector) where.sectors = ArrayContains([sector]);
    if (subSector) where.subSectors = ArrayContains([subSector]);
    if (targetAmount) {
      where.minFunding = LessThanOrEqual(targetAmount);
      where.maxFunding = MoreThanOrEqual(targetAmount);
    }
    if (useOfFunds) where.useOfFunds = ArrayContains([useOfFunds]);

    const [investors, matches] = await this.investorsRepository.findAndCount({
      where,
    });
    const newSearchEntry = this.userSearchRepository.create({
      sector,
      country,
      targetAmount,
      useOfFunds,
      subSector,
      matches,
    });
    await this.userSearchRepository.save(newSearchEntry);
    return { investors, q };
  }

  async getUserSearchHistories(
    page: number = 1,
    limit: number = 1000,
  ): Promise<{
    data: InvestorsRepositorySearchHistory[];
    total_count: number;
  }> {
    const skip = (page - 1) * limit;
    const [data, total_count] = await this.userSearchRepository.findAndCount({
      skip,
      take: limit,
    });
    return { data, total_count };
  }
}
