import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEligibilityRuleDto } from './dto/eligibility-rules.dto';

@Controller('vouchers')
export class VoucherController {

    constructor(private service: VoucherService){}

    @Post()
    async createVoucher(@Body() body: CreateVoucherDto){
        const { type, percentageDiscount, maxUses } =body;

        
        return body
    }

    @Post('/eligibility-rule')
    async createEligilityRule(@Body() body: CreateEligibilityRuleDto){
        return await this.service.createEligibilityRule(body)
    }


    @Get()
    async findallVouchers(){
        return await this.service.findAllVouchers();
    }

    @Post()
    redeemVoucher(){
         
    }
}
