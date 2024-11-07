import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { VoucherService } from './voucher.service';

@Controller('vouchers')
export class VoucherController {

    constructor(private service: VoucherService){}

    @Post()
    create(@Body() body: CreateVoucherDto){
        return 'Hello, world'
    }

    @Get()
    async findall(){
        return await this.service.findAll();
    }

    @Post()
    redeemVoucher(){
         
    }
}
