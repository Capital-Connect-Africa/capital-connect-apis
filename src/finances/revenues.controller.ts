import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { Revenue } from "./entities/revenue.entity";
import { RevenuesService } from "./revenues.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('revenues')
export class RevenueController {
  constructor(private readonly revenueService: RevenuesService) {}

  @Post()
  async createRevenue(@Body() createRevenueDto: CreateRevenueDto): 
  Promise<Revenue> {
    return await this.revenueService.create(createRevenueDto);
  }

  @Get()
  async findAllRevenues(): Promise<Revenue[]> {
    return await this.revenueService.findAll();
  }

  @Get(':id')
  async findRevenueById(@Param('id') id: number): 
  Promise<Revenue> {
    const revenue = await this.revenueService.findOne(id);
    if (!revenue) {
      throw new NotFoundException(`Revenue with ID ${id} not found`);
    }
    return revenue;
  }

  @Put(':id')
  async updateRevenue(
    @Param('id') id: number,
    @Body() updateRevenueData: Partial<Revenue>): Promise<Revenue> {
    const revenue = await this.revenueService.update(id, updateRevenueData);
    if (!revenue) {
      throw new NotFoundException(`Revenue with ID ${id} not found`);
    }
    return revenue;
  }

  @Delete(':id')
  async deleteRevenue(@Param('id') id: number): 
  Promise<{ message: string }> {
    await this.revenueService.delete(id);
    return { message: `Revenue with ID ${id} has been deleted` };
  }
}