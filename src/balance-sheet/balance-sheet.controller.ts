import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { BalanceSheetService } from './balance-sheet.service';
import { CreateBalanceSheetDto } from './dto/create-balance-sheet.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance-sheet.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('balance-sheet')
export class BalanceSheetController {
  constructor(private readonly balanceSheetService: BalanceSheetService) {}

  @Post()
  async create(@Body() createBalanceSheetDto: CreateBalanceSheetDto) {
    return this.balanceSheetService.create(createBalanceSheetDto);
  }

  @Get()
  async findAll() {
    return this.balanceSheetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.balanceSheetService.findOne(id);
  }

  @Get('company/:companyId')
  async findByCompanyId(@Param('companyId') companyId: number) {
    return this.balanceSheetService.findByCompanyId(companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBalanceSheetDto: UpdateBalanceSheetDto,
  ) {
    return this.balanceSheetService.update(id, updateBalanceSheetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.balanceSheetService.remove(id);
  }
}
