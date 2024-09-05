import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CompanyService } from 'src/company/company.service';
import { UsersService } from 'src/users/users.service';
import { CreateFileDto } from './dto/create-file.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FilesService {
  constructor(
    private companyService: CompanyService,
    private userService: UsersService,
    private s3Service: S3Service,
  ) {}

  @InjectRepository(File)
  private fileRepository: Repository<File>;

  async createComponyLogo(userId: number, createFileDto: CreateFileDto) {
    const user = await this.userService.findOne(userId);
    const companyFound = await this.companyService.findOneByUser(user.id);
    if (!companyFound) {
      throw new NotFoundException('Company not found');
    } else {
      const newLogo = this.fileRepository.create(createFileDto);
      const savedLogo = await this.fileRepository.save(newLogo);
      this.companyService.updateLogoUrl(companyFound.id, savedLogo.id);

      return newLogo;
    }
  }

  //s3
  async addCompanyLogo(file: Express.Multer.File, userId: number) {
    const createFileDto = new CreateFileDto();
    const key = `${file.fieldname}${Date.now()}`;
    const user = await this.userService.findOne(userId);
    console.log('User', user);
    const companyFound = await this.companyService.findOneByUser(user.id);
    console.log('Company', companyFound);
    if (!companyFound) {
      throw new NotFoundException('Company not found');
    } else {
      const logoUrl = await this.s3Service.uploadFile(file, key);
      createFileDto.path = logoUrl;
      const newLogo = this.fileRepository.create(createFileDto);
      const savedLogo = await this.fileRepository.save(newLogo);
      await this.companyService.updateLogoUrl(companyFound.id, savedLogo.id);
    }
  }
}
