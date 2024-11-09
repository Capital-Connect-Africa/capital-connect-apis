import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { CreateEligibilityRuleDto } from './dto/create-eligibility-rules.dto';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { generateCryptCode } from 'src/shared/helpers/crypto-generator.helper';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, RequestMethod, UseGuards } from '@nestjs/common';
import { handleError } from 'src/shared/helpers/error-handler.helper';

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
        handleError(error, RequestMethod.POST);
      }
    }

    @Roles(Role.Admin)
    @Post('rules/')
    async createRule(@Body() body: CreateEligibilityRuleDto){
        try {
            return await this.voucherService.createRule(body);
            
        } catch (error) {
            throw handleError(error, RequestMethod.POST);
        }
    }

    @Get('list')
    async findVouchers(@Query('page') page: number, @Query('limit') limit: number) {
        try {
            const vouchers = await this.voucherService.findVouchers(page, limit);
            return vouchers;
            
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }  
    
    @Roles(Role.Admin)
    @Get('rules/list')
    async findRules(@Query('page') page: number, @Query('limit') limit: number){
        try {
            const rules = await this.voucherService.findRules(page, limit);
            return rules;
            
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Get('find-by-code/:code')
    async findVoucherByCode(@Param('code') code: string){
        if (!code) {
          throw new NotFoundException('Voucher code is required');
        }
        try {
          const voucher = await this.voucherService.findVoucherByCode(code);
          return voucher;
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Get('find-by-id/:id')
    async findVoucherById(@Param('id') voucherId: number) {
        if (!voucherId) {
            throw new NotFoundException('Voucher ID is required');
        }
        try {
            const voucher = await this.voucherService.findVoucherById(voucherId);
            return voucher;
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }    

    @Roles(Role.Admin)
    @Get('rules/find-by-id/:id')
    async findRuleById(@Param('id') ruleId: number){
        try {
            const rule = await this.voucherService.findRuleById(ruleId);
            return rule;
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Roles(Role.Admin)
    @Put('update/:id')
    async updateVoucher(
      @Param('id') voucherId: number,
      @Body() updateData: UpdateVoucherDto, 
      @Body('rules') rules: number[] 
    ) {
        try {
            return await this.voucherService.updateVoucher(voucherId, updateData, rules);
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }
    }

    @Roles(Role.Admin)
    @Put('rules/update/:id')
    async updateRule(@Param('id') ruleId: number, @Body() 
    updateEligibilityRuleDto: UpdateEligibilityRuleDto){
        try {
            return await this.voucherService.updateRule(ruleId, updateEligibilityRuleDto);
            
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }

    }

    @Roles(Role.Admin)
    @Delete('remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeVoucher(@Param('id') id:number){
        try {
            return await this.voucherService.removeVoucher(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @Roles(Role.Admin)
    @Delete('rules/remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeRule(@Param('id') id:number){
        try {
            return await this.voucherService.removeRule(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @Roles(Role.Investor, Role.User)
    @Post('redeem')
    async redeemVoucher(@Body() body: RedeemVoucherDto) {
        
        try {
            const { userId, voucherCode, purchase } = body;
            const voucherDetails = await this.voucherService.redeemVoucher(userId, voucherCode, purchase);
            return voucherDetails;
        } catch (error) {
            handleError(error, RequestMethod.POST);
        }
    }
}