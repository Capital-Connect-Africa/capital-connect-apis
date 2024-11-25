import { 
  Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, UseGuards
} from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finances')
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
  ) {}

  @Post()
  async createFinance(@Body() createFinanceDto: CreateFinanceDto) {
      const finance = await this.financesService.create(createFinanceDto);
      return {
        message: 'Finance record created successfully',
        data: finance,
      };
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
