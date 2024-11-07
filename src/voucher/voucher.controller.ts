import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, RequestMethod } from '@nestjs/common';
import { CreateEligibilityRuleDto } from './dto/create-eligibility-rules.dto';
import { generateCryptCode } from 'src/shared/helpers/crypto-generator.helper';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { handleError } from 'src/shared/helpers/error-handler.helper';

@Controller('vouchers')
export class VoucherController {

    constructor(private service: VoucherService){}

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

    @Post('rules')
    async createRule(@Body() body: CreateEligibilityRuleDto){
        try {
            return await this.service.createRule(body);
            
        } catch (error) {
            handleError(error, RequestMethod.POST);
        }
    }

    @Get('rules/list')
    async findRules(@Query('page') page:number, @Query('limit') limit:number){
        try {

            return await this.service.findRules(page, limit);

        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Put('update/:id')
    async updateVoucher(@Param('id') id:number, @Body() body:UpdateVoucherDto){
        try {
            return this.service.updateVoucher(id, body)
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }
    }

    @Put('rules/update/:id')
    async updateRule(@Param('id') id:number, @Body() body:UpdateEligibilityRuleDto){
        try {
            return this.service.updateRule(id, body);
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }
    }

    @Get('rules/find-by-id/:id')
    async findRuleById(@Param('id') id:number){
        try {
            return this.service.findRuleById(id);
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Get('list')
    async findVouchers(@Query('page') page:number, @Query('limit') limit:number){
        try {
            return await this.service.findVouchers(page, limit);
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }
    @Get('find-by-code/:code')
    async findVoucherByCode(@Param('code') code:string){
        try {

            return this.service.findVoucherByCode(code);

        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Get('find-by-id/:id')
    async findVoucherById(@Param('id') id:number){
        try {

            return this.service.findVoucherById(id);

        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Delete('remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeVoucher(@Param('id') id:number){
        try {
            return await this.service.removeVoucher(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @Delete('rules/remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeRule(@Param('id') id:number){
        try {
            return await this.service.removeRule(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

}