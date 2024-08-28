import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { InvestorTypesService } from './investor-types.service';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investor-types')
export class InvestorTypesController {
  constructor(private readonly investorTypesService: InvestorTypesService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createInvestorTypeDto: CreateInvestorTypeDto) {
    try {
      return this.investorTypesService.create(createInvestorTypeDto);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.investorTypesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.investorTypesService.findOne(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateInvestorTypeDto: UpdateInvestorTypeDto,
  ) {
    try {
      await this.investorTypesService.findOne(+id);
      const type = await this.investorTypesService.update(
        +id,
        updateInvestorTypeDto,
      );
      return type;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Investor type with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.investorTypesService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
