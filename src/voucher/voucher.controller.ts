import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';

@Controller('vouchers')
export class VoucherController {
    @Post()
    createVoucher(@Body() body: CreateVoucherDto){
        return 'Hello, world'
    }

    @Get()
    getVoucher(){
        return ''
    }

    @Post()
    redeemVoucher(){
         
    }
}
