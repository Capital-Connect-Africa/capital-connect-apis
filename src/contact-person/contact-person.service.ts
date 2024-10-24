import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { ContactPerson } from './entities/contact-person.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { GrantAccessDto } from './dto/grant-access.dto';
import { UsersService } from '../users/users.service';
import { User } from "../users/entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { contactPersonWelcomeEmailTemplate } from "../templates/contact-persons-welcome-email";

@Injectable()
export class ContactPersonService {
  constructor(
    @InjectRepository(ContactPerson)
    private contactPersonRepository: Repository<ContactPerson>,
    @InjectRepository(InvestorProfile)
    private investorProfileRepository: Repository<InvestorProfile>,
    private usersService: UsersService,
    private authService: AuthService
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

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ContactPerson[]> {
    const skip = (page - 1) * limit;
    return this.contactPersonRepository.find({
      skip,
      take: limit,
      relations: ['investorProfile'],
      order: { id: 'DESC' },
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

  async grantAccess(grantAccessDto: GrantAccessDto) {
    const { contactPersonId, investorProfileId } = grantAccessDto;
    const contactPerson = await this.contactPersonRepository.findOne({
      where: { id: contactPersonId },
    });
    if (!contactPerson) {
      throw new NotFoundException(
        `Contact person with id ${contactPersonId} was not found`,
      );
    }

    const investorProfile = await this.investorProfileRepository.findOne({
      where: { id: investorProfileId },
    });

    if (!investorProfile) {
      throw new NotFoundException(
        `Investor profile with id ${investorProfileId} was not found`,
      );
    }

    const password = Math.random().toString(36).slice(-10);

    let user = await this.usersService.create({
      username: contactPerson.emailAddress,
      firstName: contactPerson.firstName,
      lastName: contactPerson.lastName,
      password: password,
      roles: 'contact_person',
    });

    user.investorProfiles = [investorProfile];
    user = await this.usersService.save(user);
    user.password = password;
    this.sendVerificationEmail(user);
    return user;
  }

  async sendVerificationEmail(user: User) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/?token=${user.emailVerificationToken}`;
    const msg = {
      to: user.username,
      from: process.env.FROM_EMAIL, // Use your verified sender
      subject: 'Email Verification',
      html: contactPersonWelcomeEmailTemplate(verificationUrl, user.password),
    };

    // await this.sendEmailVerificatioinMailViaSendGrid(msg);
    await this.authService.sendEmailVerificationMailViaBrevo(msg, user);
  }
}
