import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, RequestMethod, UseGuards } from '@nestjs/common';
import { CreateEligibilityRuleDto } from './dto/create-eligibility-rules.dto';
import { generateCryptCode } from 'src/shared/helpers/crypto-generator.helper';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { handleError } from 'src/shared/helpers/error-handler.helper';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';

@Controller('vouchers')
export class VoucherController {

    constructor(private service: VoucherService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async createVoucher(@Body() body: CreateVoucherDto) {
        try {
            const { type, percentageDiscount, maxUses, expiresAt, rules, maxAmount } =body;
            const code =generateCryptCode().toUpperCase();
            return await this.service.createVoucher(
                { type, percentageDiscount, maxUses, expiresAt, code, maxAmount  }, 
                rules
            )
        
        } catch (error) {
            handleError(error, RequestMethod.POST);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('rules')
    async createRule(@Body() body: CreateEligibilityRuleDto){
        try {
            return await this.service.createRule(body);
            
        } catch (error) {
            handleError(error, RequestMethod.POST);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('rules/list')
    async findRules(@Query('page') page:number, @Query('limit') limit:number){
        try {

            return await this.service.findRules(page, limit);

        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('update/:id')
    async updateVoucher(@Param('id') id:number, @Body() body:UpdateVoucherDto){
        try {
            return this.service.updateVoucher(id, body)
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('rules/update/:id')
    async updateRule(@Param('id') id:number, @Body() body:UpdateEligibilityRuleDto){
        try {
            return this.service.updateRule(id, body);
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('rules/find-by-id/:id')
    async findRuleById(@Param('id') id:number){
        try {
            return this.service.findRuleById(id);
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('list')
    async findVouchers(@Query('page') page:number, @Query('limit') limit:number){
        try {
            return await this.service.findVouchers(page, limit);
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-by-code/:code')
    async findVoucherByCode(@Param('code') code:string){
        try {

            return this.service.findVoucherByCode(code);

        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-by-id/:id')
    async findVoucherById(@Param('id') id:number){
        try {

            return this.service.findVoucherById(id);

        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeVoucher(@Param('id') id:number){
        try {
            return await this.service.removeVoucher(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('rules/remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeRule(@Param('id') id:number){
        try {
            return await this.service.removeRule(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Investor, Role.User)
    @Post('redeem-voucher')
    @HttpCode(HttpStatus.OK)
    async redeemVoucher(@Body() body: RedeemVoucherDto){
        try {
            const {userId, voucherCode, purchase} =body;
            return await this.service.reedemVoucher(userId, voucherCode, purchase)
        } catch (error) {
            handleError(error, RequestMethod.POST)
        }
    }
}