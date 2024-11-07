import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { EligibilityRule } from './entities/eligibility-rule.entity';

@Injectable()
export class VoucherService {

    constructor(
        @InjectRepository(Voucher)
        private voucherRepository: Repository<Voucher>,

        @InjectRepository(EligibilityRule)
        private eligibilityRuleRepository: Repository<EligibilityRule>,
    ) {}

    async findAllVouchers(): Promise<Voucher[]>{

        const vouchers =await this.voucherRepository.find({
            relations: ['rules'],
            order: {
                id: 'DESC'
            },
            
        })

        return vouchers
    }

    async createVoucher(voucher: Partial<Voucher>, ruleIds:number[] =[]): Promise<Voucher>{
        const rules = ruleIds ? await this.eligibilityRuleRepository.find({where: {id: In(ruleIds)}}) : [];
        const newVoucher = this.voucherRepository.create({...voucher, rules});
        
        
        return await this.voucherRepository.save(newVoucher);
    }

    async updateVoucher(voucherId:number, voucher: Partial<Voucher>): Promise<Voucher>{
        await this.voucherRepository.update(voucherId, voucher);
        return await this.voucherRepository.findOne({where: {id: voucherId}})
    }

    async createEligibilityRule(rule: Partial<EligibilityRule>){
        const newRule =this.eligibilityRuleRepository.create(rule);
        return await this.eligibilityRuleRepository.save(newRule);
    }

}