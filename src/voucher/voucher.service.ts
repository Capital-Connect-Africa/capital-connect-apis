import { In, Repository } from 'typeorm';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { EligibilityRule } from './entities/eligibility-rule.entity';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';

@Injectable()
export class VoucherService {

    constructor(
        @InjectRepository(Voucher)
        private readonly voucherRepository: Repository<Voucher>,
        @InjectRepository(EligibilityRule)
        private readonly eligibilityRuleRepository: Repository<EligibilityRule>,
    ) {}

    async findVouchers(page:number =1, limit:number =10): Promise<Voucher[]>{
        const skip = (page -1) *limit
        const vouchers =await this.voucherRepository.find({
            skip,
            take: limit,
            relations: ['rules'],
            order: {
                id: 'DESC'
            },
        });
        return vouchers;
    }

    async findRules(page:number =1, limit:number =10): Promise<EligibilityRule[]>{
        const skip =(page - 1) * limit;
        const eligibilityRules =await this.eligibilityRuleRepository.find({ skip, take: limit, order: {id: 'DESC'}})
        return eligibilityRules;
    }

    async createVoucher(voucher: Partial<Voucher>, ruleIds:number[] =[]): Promise<Voucher>{
        const existingVoucher =await this.voucherRepository.findOne({where: {code: voucher.code}});
        if(existingVoucher) throw new ConflictException('Voucher with code already exists');
        const rules = ruleIds ? await this.eligibilityRuleRepository.find({where: {id: In(ruleIds)}}) : [];
        const newVoucher = this.voucherRepository.create({...voucher, rules});
        return await this.voucherRepository.save(newVoucher);
    }

    async updateVoucher(voucherId:number, body:UpdateVoucherDto){
        const existingVoucher = await this.voucherRepository.findOne({where: {id: voucherId}})
        if(!existingVoucher) throw new NotFoundException('Voucher with id not found');
        const {maxAmount, maxUses, type, expiresAt, percentageDiscount, rules} = body;
        const updatedVoucher:Partial<Voucher> = {};
        if(maxAmount) updatedVoucher.maxAmount =maxAmount;
        if(maxUses) updatedVoucher.maxUses =maxUses;
        if(type) updatedVoucher.type =type;
        if(expiresAt) updatedVoucher.expiresAt =expiresAt;
        if(percentageDiscount) updatedVoucher.percentageDiscount =percentageDiscount;
        if(rules) updatedVoucher.rules = await this.eligibilityRuleRepository.find({where: {id: In(rules)}});
        const voucher:Voucher ={...existingVoucher, ...updatedVoucher};
        await this.voucherRepository.update(voucherId, voucher);
        return voucher;
    }

    async createRule(rule: Partial<EligibilityRule>){
        const existingRule =await this.eligibilityRuleRepository.findOne({where: rule});
        if(existingRule) throw new ConflictException('Rule already added');
        const newRule =this.eligibilityRuleRepository.create(rule);
        try {
            return await this.eligibilityRuleRepository.save(newRule);
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateRule(ruleId:number, data:UpdateEligibilityRuleDto): Promise<EligibilityRule>{
        const existingEligibilityRule = await this.eligibilityRuleRepository.findOne({where: {id: ruleId}});
        if(!existingEligibilityRule) throw new NotFoundException("Rule with id not found");
        const updatedEligibilityRule:Partial<EligibilityRule> = {};
        const {userProperty, operator, value} = data;
        if(value) updatedEligibilityRule.value = value;
        if(operator) updatedEligibilityRule.operator = operator;
        if(userProperty) updatedEligibilityRule.userProperty = userProperty;
        const rule = {...existingEligibilityRule, ...updatedEligibilityRule};
        await this.eligibilityRuleRepository.update(ruleId, rule);
        return rule;
    }

    async findVoucherById(voucherId: number): Promise<Voucher>{
        const voucher = await this.voucherRepository.findOne({where: {id: voucherId}, relations: ['rules'] });
        if(!voucher) throw new NotFoundException('Voucher with id not found');
        return voucher;
    }

    async findRuleById(ruleId: number): Promise<EligibilityRule> {
        const rule = await this.eligibilityRuleRepository.findOne({where: {id: ruleId}});
        if(!rule) throw new NotFoundException('Rule with id not found');
        return rule;
    }

    async findVoucherByCode(code: string): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({where: {code}, relations: ['rules'] });
        if(!voucher) throw new NotFoundException('Voucher code not found');
        return voucher;
    }

    async removeVoucher(voucherId:number): Promise<void>{
        const existingVoucher =await this.voucherRepository.findOne({where: {id: voucherId}})
        if(!existingVoucher) throw new NotFoundException('Voucher with id not found');
        await this.voucherRepository.delete(voucherId);
        return;
    }

    async removeRule(ruleId:number): Promise<void>{
        const existingRule =await this.eligibilityRuleRepository.findOne({where: {id: ruleId}})
        if(!existingRule) throw new NotFoundException('Rule with id not found');
        await this.eligibilityRuleRepository.delete(ruleId);
        return;
    }

}