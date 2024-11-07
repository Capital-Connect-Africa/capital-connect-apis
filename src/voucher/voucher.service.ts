import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VoucherService {

    constructor(
        @InjectRepository(Voucher)
        private voucherRepository: Repository<Voucher>,
    ) {}

    async findAll(): Promise<Voucher[]>{
        const vouchers =await this.voucherRepository.find({
            relations: ['rules'],
            order: {
                id: 'DESC'
            },
            
        })

        return vouchers
    }
}