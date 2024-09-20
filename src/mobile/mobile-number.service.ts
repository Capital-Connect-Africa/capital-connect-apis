import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobileNumber } from './entities/mobile-number.entity';
import { CreateMobileNumberDto } from './dto/create-mobile-number.dto';
import { UpdateMobileNumberDto } from './dto/update-mobile-number.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MobileNumberService {
  constructor(
    @InjectRepository(MobileNumber)
    private mobileNumbersRepository: Repository<MobileNumber>,
  ) {}

  async create(createMobileNumberDto: CreateMobileNumberDto) {
    const existingMobileNumber = await this.mobileNumbersRepository.findOne({
      where: { phoneNo: createMobileNumberDto.phoneNo },
    });
  
    if (existingMobileNumber) {
      throw new Error('Mobile number already taken, please add a new one');
    }
  
    const userMobileNumber = await this.mobileNumbersRepository.findOne({
      where: { user: { id: createMobileNumberDto.userId } },
    });
  
    if (userMobileNumber) {
      userMobileNumber.phoneNo = createMobileNumberDto.phoneNo;
      return await this.mobileNumbersRepository.save(userMobileNumber);
    }

    const mobileNo = this.mobileNumbersRepository.create({
      ...createMobileNumberDto,
    });
  
    mobileNo.user = { id: createMobileNumberDto.userId } as User;
  
    return await this.mobileNumbersRepository.save(mobileNo);
  }    

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.mobileNumbersRepository.find({
      skip,
      take: limit,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const mobile = await this.mobileNumbersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!mobile) {
      throw new NotFoundException(`Mobile Number with id ${id} not found`);
    }
    return mobile;
  }

  async update(id: number, updateMobileNumberDto: UpdateMobileNumberDto) {
    const { phoneNo, isVerified } = updateMobileNumberDto;
    const updates = {};
    if (phoneNo) updates['phoneNo'] = phoneNo;
    if (isVerified) updates['isVerified'] = isVerified;
    if (Object.keys(updates).length > 0)
      await this.mobileNumbersRepository.update(id, updateMobileNumberDto);
    return this.mobileNumbersRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.mobileNumbersRepository.delete(id);
  }
}
