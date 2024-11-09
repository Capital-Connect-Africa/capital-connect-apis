import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { User } from 'src/users/entities/user.entity';
import { EligibilityRule } from './entities/eligibility-rule.entity';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException, RequestMethod } from '@nestjs/common';
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
            relations: ['rules', 'users', 'users.user'],
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
        if (!user) throw new NotFoundException('Error retrieving your information');
        
        const voucher = await this.voucherRepository.findOne({where: {code: voucherCode,}, relations: ['rules', 'users', 'users.user']});
        if (!voucher) throw new BadRequestException('Invalid voucher code');

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
        console.log(voucher.users.length, voucher.maxUses);
        
        if (voucher.users && voucher.users.length >= voucher.maxUses) 
            throw new ConflictException("Voucher has already been applied");
    
        // Check if user has already applied the voucher
        if (voucher.users && voucher.users.map(userVoucher =>userVoucher.user.id).includes(user.id)) 
            throw new ConflictException("You already applied this voucher");
    
        // Check if the voucher is expired
        if (voucher.expiresAt.getTime() < new Date().getTime()) 
            throw new ConflictException("Voucher validity expired");
    
        const rules =voucher.rules || [];
        // Process each rule
        for (let rule of rules) {
            let userPropertyValue = user[rule.userProperty];
            let errorMessage:string =null
            
            switch (rule.operator) {
                case Operators.EQUAL_TO:
                    if (userPropertyValue !== rule.value) 
                        errorMessage =rule.description;
                    break;
    
                case Operators.GREATER_THAN:  
                    if (userPropertyValue <= rule.value) 
                        errorMessage =rule.description;
                    break;
    
                case Operators.LESS_THAN:  
                    if (userPropertyValue >= rule.value) 
                        errorMessage =rule.description;
                    break;
    
                case Operators.GREATER_THAN_OR_EQUAL_TO:  
                    if (userPropertyValue < rule.value) 
                        errorMessage =rule.description;
                    break;
    
                case Operators.LESS_THAN_OR_EQUAL_TO:  
                    if (userPropertyValue > rule.value) 
                        errorMessage =rule.description
                    break;
    
                default:
                    errorMessage ='You are not eligible to apply this voucher'
            }

            if(errorMessage) throw new ConflictException(errorMessage);
        }

        /**
         * TODO: @meltus
         *      implement checks for other types e.g dates, arrays
         *      implement checks for value ranges
        */
    
        return true; // If all checks pass, voucher can be redeemed
    }
}