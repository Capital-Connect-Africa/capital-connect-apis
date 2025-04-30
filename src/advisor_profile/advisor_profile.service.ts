import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvisorProfileDto } from './dto/create-advisor_profile.dto';
import { UpdateAdvisorProfileDto } from './dto/update-advisor_profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvisorProfile } from './entities/advisor_profile.entity';
import { User } from 'src/users/entities/user.entity';
import { feeStructure, Role, servicesOffered } from './advisor.type';

@Injectable()
export class AdvisorProfileService {
  constructor(
    @InjectRepository(AdvisorProfile)
    private readonly advisorProfileRepository: Repository<AdvisorProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create( createAdvisorProfileDto: CreateAdvisorProfileDto): Promise<AdvisorProfile> {
    const { userId } = createAdvisorProfileDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} does not exist.`);
    }
    const advisorProfile = this.advisorProfileRepository.create({
      ...createAdvisorProfileDto,
      user: { id: userId },
    });
    return await this.advisorProfileRepository.save(advisorProfile);
  }

  async findAll(): Promise<AdvisorProfile[]> {
    return await this.advisorProfileRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<AdvisorProfile> {
    const advisor = await this.advisorProfileRepository.findOne({ 
      where: { id },
      relations: ['user'], 
    });
    if (!advisor) throw new NotFoundException(`Advisor with ID ${id} not found`);
    return advisor;
  }

  async findByUserId(userId: number): Promise<AdvisorProfile> {
    const advisor = await this.advisorProfileRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['user'], 
    });
    if (!advisor) throw new NotFoundException(`Advisor with userId ${userId} not found`);
    return advisor;
  }

  async update(id: number, data: Partial<AdvisorProfile>): Promise<AdvisorProfile> {
    await this.advisorProfileRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const advisor = await this.findOne(id);
    await this.advisorProfileRepository.remove(advisor);
  }

  roles(): Array<string> {
    return Object.values(Role);
  }

  servicesOffered(): Array<string> {
    return Object.values(servicesOffered);
  }

  feeStructure(): Array<string> {
    return Object.values(feeStructure);
  }
}
