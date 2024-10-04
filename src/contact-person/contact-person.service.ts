import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { ContactPerson } from './entities/contact-person.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';

@Injectable()
export class ContactPersonService {
  constructor(
    @InjectRepository(ContactPerson)
    private contactPersonRepository: Repository<ContactPerson>,
  ) {}

  async create(
    createContactPersonDto: CreateContactPersonDto,
  ): Promise<ContactPerson> {
    const contactPerson = this.contactPersonRepository.create(
      createContactPersonDto,
    );
    contactPerson.investorProfile = {
      id: createContactPersonDto.investorProfileId,
    } as InvestorProfile;
    return this.contactPersonRepository.save(contactPerson);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ContactPerson[]> {
    const skip = (page - 1) * limit;
    return this.contactPersonRepository.find({
      skip,
      take: limit,
      relations: ['investorProfile'],
      order: {id: 'DESC'},
    });
  }

  async findOne(id: number): Promise<ContactPerson> {
    return this.contactPersonRepository.findOne({
      where: { id },
      relations: ['investorProfile'],
    });
  }

  async update(
    id: number,
    updateContactPersonDto: UpdateContactPersonDto,
  ): Promise<ContactPerson> {
    await this.contactPersonRepository.update(id, updateContactPersonDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.contactPersonRepository.delete(id);
  }
}
