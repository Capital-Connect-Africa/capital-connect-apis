import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { OpexService } from "./opex.service";
import { CreateOpexDto } from "./dto/create-opex.dto";
import { Opex } from "./entities/opex.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('opex')
export class OpexController {
  constructor(private readonly opexService: OpexService) {}

  @Post()
  async createOpex(@Body() createOpexDto: CreateOpexDto): 
  Promise<Opex> {
    return await this.opexService.create(createOpexDto);
  }

  @Get()
  async findAllOpex(): Promise<Opex[]> {
    return await this.opexService.findAll();
  }

  @Get('company/:companyId')
  async findByCompanyId(@Param('companyId') companyId: number): Promise<Opex[]> {
    return await this.opexService.findByCompanyId(companyId);    
  }

  @Get(':id')
  async findOpexById(@Param('id') id: number): 
  Promise<Opex> {
    const opex = await this.opexService.findOne(id);
    if (!opex) {
      throw new NotFoundException(`Opex with ID ${id} not found`);
    }
    return opex;
  }

  @Put(':id')
  async updateOpex(
    @Param('id') id: string, 
    @Body() updateOpexData: Partial<Opex>): Promise<Opex> {
    const opex = await this.opexService.update(Number(id), updateOpexData);
    if (!opex) {
      throw new NotFoundException(`Opex with ID ${id} not found`);
    }
    return opex;
  }

  @Delete(':id')
  async deleteOpex(@Param('id') id: number): 
  Promise<{ message: string }> {
    await this.opexService.delete(id);
    return { message: `Opex with ID ${id} has been deleted` };
  }
}