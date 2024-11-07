import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { EligibilityRule } from './entities/eligibility-rule.entity';

@Injectable()
export class VoucherService {

    constructor(
        @InjectRepository(Voucher)
        private readonly voucherRepository: Repository<Voucher>,
        @InjectRepository(EligibilityRule)
        private readonly eligibilityRuleRepository: Repository<EligibilityRule>,
    ) {}

    async findAllVouchers(page:number =1, limit:number =10): Promise<Voucher[]>{
        const skip = (page -1) *limit
        const vouchers =await this.voucherRepository.find({
            skip,
            take: limit,
            relations: ['rules'],
            order: {
                id: 'DESC'
            },
        })
        return vouchers;
    }

    async findAllEligibilityRules(page:number =1, limit:number =10): Promise<EligibilityRule[]>{
        const skip =(page - 1) * limit;
        const eligibilityRules =await this.eligibilityRuleRepository.find({ skip, take: limit, order: {id: 'DESC'}})
        return eligibilityRules;
    }

    async createVoucher(voucher: Partial<Voucher>, ruleIds:number[] =[]): Promise<Voucher>{
        const rules = ruleIds ? await this.eligibilityRuleRepository.find({where: {id: In(ruleIds)}}) : [];
        const newVoucher = this.voucherRepository.create({...voucher, rules});
        return await this.voucherRepository.save(newVoucher);
    }

    

    async createEligibilityRule(rule: Partial<EligibilityRule>){
        const newRule =this.eligibilityRuleRepository.create(rule);
        return await this.eligibilityRuleRepository.save(newRule);
    }

    async updateEligibilityRule(ruleId:number, rule:EligibilityRule): Promise<EligibilityRule>{
        await this.eligibilityRuleRepository.update(ruleId, rule);
        return await this.eligibilityRuleRepository.findOne({where: {id: ruleId}});
    }

    async getVoucherById(voucherId: number): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({where: {id: voucherId}, relations: ['rules'] });
        return voucher;
    }

    async getVoucherByCode(code: string): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({where: {code}, relations: ['rules'] });
        return voucher;
    }

    async removeVoucher(voucherId:number): Promise<void>{
        await this.voucherRepository.delete(voucherId);
        return;
    }

    async removeEligibilityRule(ruleId:number): Promise<void>{
        await this.eligibilityRuleRepository.delete(ruleId);
        return;
    }

}