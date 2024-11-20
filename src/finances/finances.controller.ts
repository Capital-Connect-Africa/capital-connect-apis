import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateFinanceSubmissionDto } from './dto/create-finance-submission.dto';
import { FinanceSubmissionService } from './finance-submission.service';
import { UpdateFinanceSubmissionDto } from './dto/update-finance-submission.dto';
import { FinanceSubmission } from './entities/finance_submission.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finances')
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
    private readonly financeSubmissionService: FinanceSubmissionService,
  ) {}

  @Post()
  async create(@Body() createFinanceDto: CreateFinanceDto){
    return this.financesService.create(createFinanceDto);
  }

  @Post('submission')
  async createSubmission(@Body() createFinanceSubmissionDto: CreateFinanceSubmissionDto): 
  Promise<FinanceSubmission> {
      return await this.financeSubmissionService.createSubmission(createFinanceSubmissionDto);
  }

  @Get()
  async findAll() {
    return this.financesService.findAll();
  }

  @Get('submission')
  async findAllSubmissions() {
    return this.financeSubmissionService.findAllSubmissions();
  }

  @Get(':id')
  async findOne(@Param('id') id: number){
    return this.financesService.findOne(id);
  }

  @Get('submission/:id')
  async findOneSubmission(@Param('id') id: number){
    return this.financeSubmissionService.findOneSubmission(id);
  }

  @Get('submissions/:userId')
  async findSubmissionsByUserId(
  @Param('userId') userId: number): 
  Promise<FinanceSubmission[]> {
      return await this.financeSubmissionService.findAllSubmissionsByUserId(userId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateFinanceDto: UpdateFinanceDto){
    return this.financesService.update(id, updateFinanceDto);
  }

  @Put('submission/:id')
  async updateSubmission(
    @Param('id') id: number,
    @Body() updateFinanceSubmissionDto: UpdateFinanceSubmissionDto){
    return this.financeSubmissionService.updateSubmission(id, updateFinanceSubmissionDto);
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

  @Delete('submission/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSubmission(@Param('id') id: number): Promise<void> {
    try{
      await this.financeSubmissionService.removeSubmission(id);
    } catch (error){
      throwInternalServer(error)
    }
  }
}
