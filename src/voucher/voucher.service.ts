import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { EligibilityRule } from './entities/eligibility-rule.entity';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VoucherType } from 'src/shared/enums/voucher.type.enum';
import { Operators } from 'src/shared/enums/operators.enum';
import { UserVoucher } from './entities/user-voucher.entity';

@Injectable()
export class VoucherService {

    constructor(
        @InjectRepository(Voucher)
        private readonly voucherRepository: Repository<Voucher>,
        @InjectRepository(EligibilityRule)
        private readonly eligibilityRuleRepository: Repository<EligibilityRule>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserVoucher)
        private readonly userVoucherRepository: Repository<UserVoucher>
    ) {}

    async findVouchers(page:number =1, limit:number =10): Promise<Voucher[]>{
        const skip = (page -1) *limit
        const vouchers =await this.voucherRepository.find({
            skip,
            take: limit,
            relations: ['rules', 'users'],
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

    async updateVoucher(voucherId: number, updateData: any, rules: number[]) {
        const voucher = await this.voucherRepository.findOne({ 
            where: { id: voucherId }, 
            relations: ['rules'] 
        });
        if (!voucher) throw new NotFoundException('Voucher not found');
    
        voucher.type = updateData.type;
        voucher.percentageDiscount = updateData.percentageDiscount;
        voucher.maxUses = updateData.maxUses;
        voucher.expiresAt = updateData.expiresAt;
        voucher.code = updateData.code;
        voucher.maxAmount = updateData.maxAmount;
    
        if (rules && rules.length > 0) {
            const ruleEntities = await Promise.all(rules.map(ruleId => 
                this.eligibilityRuleRepository.findOne({ where: { id: ruleId } })
            ));

            const notFoundRules = ruleEntities.filter(rule => !rule);
            if (notFoundRules.length > 0) {
                throw new NotFoundException('One or more rules not found');
            }
    
            voucher.rules = ruleEntities as EligibilityRule[];
        } else {
            voucher.rules = [];
        }
    
        return await this.voucherRepository.save(voucher);
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

    async updateRule(ruleId: number, updateEligibilityRuleDto: UpdateEligibilityRuleDto): Promise<EligibilityRule> {
        const { userProperty, operator, value } = updateEligibilityRuleDto;
        const updates = {};
    
        if (value) updates['value'] = value;
        if (operator) updates['operator'] = operator;
        if (userProperty) updates['userProperty'] = userProperty;
    
        if (Object.keys(updates).length > 0) {
            await this.eligibilityRuleRepository.update(ruleId, updates);
        }
    
        return this.eligibilityRuleRepository.findOneBy({ id: ruleId });
    }       

    async findVoucherById(voucherId: number): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({
            where: { id: voucherId }, 
            relations: ['rules']
        });
        if (!voucher) {
            throw new NotFoundException(`Voucher with id ${voucherId} not found`);
        }
        return voucher;
    }    

    async findRuleById(ruleId: number): Promise<EligibilityRule> {
        const rule = await this.eligibilityRuleRepository.findOne({where: {id: ruleId}});
        if(!rule) throw new NotFoundException('Rule with id not found');
        return rule;
    }

    async findVoucherByCode(code: string): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({
          where: { code },
          relations: ['rules'],
        });
        if (!voucher) throw new NotFoundException('Voucher code not found');
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

    async redeemVoucher(userId: number, voucherCode: string, purchase: VoucherType) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Unable to pull your information');
    
        const voucher = await this.findVoucherByCode(voucherCode);
        if (!voucher) throw new NotFoundException('Voucher not found');
    
        const canRedeemVoucher = this._canRedeemVoucher(user, voucher, purchase);
        if (!canRedeemVoucher) {
            throw new BadRequestException('Voucher cannot be redeemed');
        }
    
        const userVoucher = this.userVoucherRepository.create({
            usedAt: new Date(),
            user,
            voucher,
        });
        await this.userVoucherRepository.save(userVoucher);
    
        voucher.users = voucher.users || [];
        voucher.users.push(userVoucher);
    
        if (voucher.maxAmount) {
            voucher.maxAmount -= 1; 
            await this.voucherRepository.update(voucher.id, { maxAmount: voucher.maxAmount });
        }
    
        return {
            code: voucher.code,
            maxAmount: voucher.maxAmount,
            discount: voucher.percentageDiscount,
        };
    }    

    private _canRedeemVoucher(user: User, voucher: Voucher, purchase: VoucherType): boolean {
        // Check if the purchase type matches
        if (purchase !== voucher.type) throw new ConflictException("Voucher not applicable for this purchase");
    
        // Check if voucher is already fully used
        if (voucher.users && voucher.users.length >= voucher.maxUses) 
            throw new ConflictException("Voucher has already been applied");
    
        // Check if user has already applied the voucher
        if (voucher.users && voucher.users.map(u => u.id).includes(user.id)) 
            throw new ConflictException("You already applied this voucher");
    
        // Check if the voucher is expired
        if (voucher.expiresAt.getTime() < new Date().getTime()) 
            throw new ConflictException("Voucher validity expired");
    
        // Ensure rules exist
        if (!voucher.rules || !voucher.rules.length) 
            return true; // or throw an error if you want to disallow vouchers with no rules
    
        // Process each rule
        for (let rule of voucher.rules) {
            let userPropertyValue = user[rule.userProperty];
    
            switch (rule.operator) {
                case Operators.EQUAL_TO:
                    if (userPropertyValue !== rule.value) 
                        throw new ConflictException(`You are not eligible to apply the voucher: ${rule.userProperty} must equal ${rule.value}`);
                    break;
    
                case Operators.GREATER_THAN:  
                    if (userPropertyValue <= rule.value) 
                        throw new ConflictException(`You are not eligible to apply the voucher: ${rule.userProperty} must be greater than ${rule.value}`);
                    break;
    
                case Operators.LESS_THAN:  
                    if (userPropertyValue >= rule.value) 
                        throw new ConflictException(`You are not eligible to apply the voucher: ${rule.userProperty} must be less than ${rule.value}`);
                    break;
    
                case Operators.GREATER_THAN_OR_EQUAL_TO:  
                    if (userPropertyValue < rule.value) 
                        throw new ConflictException(`You are not eligible to apply the voucher: ${rule.userProperty} must be greater than or equal to ${rule.value}`);
                    break;
    
                case Operators.LESS_THAN_OR_EQUAL_TO:  
                    if (userPropertyValue > rule.value) 
                        throw new ConflictException(`You are not eligible to apply the voucher: ${rule.userProperty} must be less than or equal to ${rule.value}`);
                    break;
    
                default:
                    throw new ConflictException(`Invalid operator ${rule.operator} in voucher rules`);
            }
        }
    
        return true; // If all checks pass, voucher can be redeemed
    }
}