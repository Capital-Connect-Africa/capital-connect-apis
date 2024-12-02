import { 
  Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, UseGuards,
  Request
} from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finances')
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
  ) {}

  @Post()
  async createFinance(@Body() createFinanceDto: CreateFinanceDto, @Request() req) {
      const user = req.user;
      const finance = await this.financesService.create(createFinanceDto, user);
      return {finance};
  }

  @Get()
  async findAll() {
    return this.financesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number){
    return this.financesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateFinanceDto: UpdateFinanceDto){
    return this.financesService.update(id, updateFinanceDto);
  }

  @Roles(Role.Admin, Role.Advisor)
  @Put(':id/notes')
  async updateNotes( @Param('id') id: number, @Body() updateData: any ) {
    return this.financesService.addNotes(id, updateData);
  }

  @Roles(Role.Admin, Role.Advisor)
  @Put(':id/approve')
  async approveFinacialRecord(@Param('id') id: number) {
    return this.financesService.approveRecord(id);
  }

  @Roles(Role.Admin, Role.Advisor)
  @Put(':id/revoke')
  async rejectFinancialRecord(@Param('id') id: number) {
    return this.financesService.rejectRecord(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try{
      await this.financesService.remove(id);
    } catch (error){
      throwInternalServer(error)
    }
  }
}
