import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEligibilityRuleDto } from './dto/create-eligibility-rules.dto';
import { generateCryptCode } from 'src/utils/helpers/crypto-generator.helper';

@Controller('vouchers')
export class VoucherController {

    constructor(private service: VoucherService){}

    @Post()
    async createVoucher(@Body() body: CreateVoucherDto){
        const { type, percentageDiscount, maxUses, expiresAt, rules, maxAmount } =body;
        const code =generateCryptCode().toUpperCase();
        
        return await this.service.createVoucher(
            { type, percentageDiscount, maxUses, expiresAt, code, maxAmount  }, 
            rules
        )
    }

    @Post('/eligibility-rule')
    async createEligilityRule(@Body() body: CreateEligibilityRuleDto){
        return await this.service.createEligibilityRule(body)
    }

    @Get('/eligibility-rule')
    async findAllEligibilityRules(@Query('page') page:number, @Query('limit') limit:number){
        return await this.service.findAllEligibilityRules(page, limit)
    }


    @Get()
    async findallVouchers(@Query('page') page:number, @Query('limit') limit:number){
        return await this.service.findAllVouchers(page, limit);
    }

    
}
