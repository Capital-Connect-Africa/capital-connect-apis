import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, RequestMethod, UseGuards } from '@nestjs/common';
import { CreateEligibilityRuleDto } from './dto/create-eligibility-rules.dto';
import { generateCryptCode } from 'src/shared/helpers/crypto-generator.helper';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vouchers')
export class VoucherController {
    constructor(private voucherService: VoucherService){}

    @Roles(Role.Admin)
    @Post()
    async createVoucher(@Body() body: CreateVoucherDto) {
      try {
        const { type, percentageDiscount, maxUses, expiresAt, rules, maxAmount } = body;
        const code = generateCryptCode().toUpperCase();
        return await this.voucherService.createVoucher(
          { type, percentageDiscount, maxUses, expiresAt, code, maxAmount },
          rules
        );
      } catch (error) { 
        throw new NotFoundException("An error occurred while creating the voucher.");
      }
    }

    @Roles(Role.Admin)
    @Post('rules')
    async createRule(@Body() body: CreateEligibilityRuleDto){
        try {
            return await this.voucherService.createRule(body);
            
        } catch (error) {
            throw new NotFoundException("An error occurred while creating the rule.");
        }
    }

    @Get()
    async findVouchers(@Query('page') page: number, @Query('limit') limit: number) {
        const vouchers = await this.voucherService.findVouchers(page, limit);
        return vouchers;
    }  
    
    @Get('rules')
    async findRules(@Query('page') page: number, @Query('limit') limit: number){
        const rules = await this.voucherService.findRules(page, limit);
        return rules;
    }

    @Get('code/:code')
    async findVoucherByCode(@Param('code') code: string){
        if (!code) {
          throw new NotFoundException('Voucher code is required');
        }
        try {
          const voucher = await this.voucherService.findVoucherByCode(code);
          return voucher;
        } catch (error) {
          throw new NotFoundException('Voucher code not found');
        }
    }

    @Get(':id')
    async findVoucherById(@Param('id') voucherId: number) {
        if (!voucherId) {
            throw new NotFoundException('Voucher ID is required');
        }
        try {
            const voucher = await this.voucherService.findVoucherById(voucherId);
            return voucher;
        } catch (error) {
            throw new NotFoundException('Voucher with the specified ID not found');
        }
    }    

    @Get('rules/:id')
    async findRuleById(@Param('id') ruleId: number){
        try {
            const rule = await this.voucherService.findRuleById(ruleId);
            return rule;
        } catch (error) {
            throw new NotFoundException('Rule with the specified ID not found');
        }
    }

    @Roles(Role.Admin)
    @Put(':id')
    async updateVoucher(
      @Param('id') voucherId: number,
      @Body() updateData: UpdateVoucherDto, 
      @Body('rules') rules: number[] 
    ) {
      return await this.voucherService.updateVoucher(voucherId, updateData, rules);
    }

    @Roles(Role.Admin)
    @Put('rules/:id')
    async updateRule(@Param('id') ruleId: number, @Body() 
    updateEligibilityRuleDto: UpdateEligibilityRuleDto){

    return await this.voucherService.updateRule(ruleId, updateEligibilityRuleDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeVoucher(@Param('id') id:number){
        try {
            return await this.voucherService.removeVoucher(id)
        } catch (error) { 
            throw new NotFoundException('Voucher with the specified ID not found');
        }
    }

    @Roles(Role.Admin)
    @Delete('rules/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeRule(@Param('id') id:number){
        try {
            return await this.voucherService.removeRule(id)
        } catch (error) { 
            throw new NotFoundException('Rule with the specified ID not found');
        }
    }

    @Roles(Role.Investor, Role.User)
    @Post('redeem-voucher')
    async redeemVoucher(@Body() body: RedeemVoucherDto) {
        const { userId, voucherCode, purchase } = body;
        if (!userId || !voucherCode) {
            throw new NotFoundException('userId and voucherCode are required');
        }

        try {
            const voucherDetails = await this.voucherService.redeemVoucher(userId, voucherCode, purchase);
            return voucherDetails;
        } catch (error) {
            throw new NotFoundException('An error occurred while redeeming the voucher');
        }
    }
}