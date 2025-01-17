import { Body, Controller, Param, Post, Get, UseGuards, NotFoundException, Put, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { CreateCostOfSalesDto } from "./dto/create-costs.dto";
import { CostOfSalesService } from "./costs.service";
import { CostOfSales } from "./entities/costs.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cost-of-sales')
export class CostOfSalesController {
  constructor(private readonly costOfSaleservice: CostOfSalesService) {}

  @Post()
  async createCostofSale(@Body() createCostOfSalesDto: CreateCostOfSalesDto): 
  Promise<CostOfSales> {
    return await this.costOfSaleservice.create(createCostOfSalesDto);
  }

  @Get()
  async findAllcostOfSales(): Promise<CostOfSales[]> {
    return await this.costOfSaleservice.findAll();
  }

  @Get('company/:companyId')
  async findByCompanyId(@Param('companyId') companyId: number): Promise<CostOfSales[]> {
    return await this.costOfSaleservice.findByCompanyId(companyId);    
  }

  @Get(':id')
  async findCostOfSaleById(@Param('id') id: number): 
  Promise<CostOfSales> {
    const costOfSales = await this.costOfSaleservice.findOne(id);
    if (!costOfSales) {
      throw new NotFoundException(`Cost Of Sale with ID ${id} not found`);
    }
    return costOfSales;
  }

  @Put(':id')
  async updateCostOfSale(
    @Param('id') id: number,
    @Body() updateCostOfSaleData: Partial<CostOfSales>): Promise<CostOfSales> {
    const costOfSales = await this.costOfSaleservice.update(id, updateCostOfSaleData);
    if (!costOfSales) {
      throw new NotFoundException(`Cost Of Sale with ID ${id} not found`);
    }
    return costOfSales;
  }

  @Delete(':id')
  async deleteCostOfSale(@Param('id') id: number): 
  Promise<{ message: string }> {
    await this.costOfSaleservice.delete(id);
    return { message: `Cost Of Sale with ID ${id} has been deleted` };
  }
}
