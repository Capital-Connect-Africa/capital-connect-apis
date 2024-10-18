import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactPersonService } from './contact-person.service';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { UpdateContactPersonDto } from './dto/update-contact-person.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { GrantAccessDto } from './dto/grant-access.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contact-persons')
export class ContactPersonController {
  constructor(private readonly contactPersonService: ContactPersonService) {}

  @Roles(Role.Investor, Role.Admin)
  @Post()
  async create(@Body() createContactPersonDto: CreateContactPersonDto) {
    try {
      return await this.contactPersonService.create(createContactPersonDto);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Roles(Role.Investor, Role.Admin)
  @Post('grant-access')
  async grantAccess(@Body() grantAccessDto: GrantAccessDto) {
    try {
      return await this.contactPersonService.grantAccess(grantAccessDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          error.message ||
            `Contact person with id ${grantAccessDto.contactPersonId} not found`,
        );
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Admin, Role.Investor, Role.Advisor)
  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      const contacts = await this.contactPersonService.findAll(page, limit);
      return contacts;
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Roles(Role.Admin, Role.Investor, Role.Advisor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.contactPersonService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Contact person with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Admin, Role.Investor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactPersonDto: UpdateContactPersonDto,
  ) {
    try {
      await this.contactPersonService.findOne(+id);
      const stage = await this.contactPersonService.update(
        +id,
        updateContactPersonDto,
      );
      return stage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Contact person with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Investor, Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.contactPersonService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
