import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Referral } from './entities/referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReferralMetricsDto } from './dto/UpdateReferralMetricsDto';

@Injectable()
export class UserReferralService {

    constructor(
        @InjectRepository(Referral)
        private readonly userReferralRepository: Repository<Referral>
    ){}

    async findReferrals(page:number =1, limit:number =10): Promise<Referral[]>{
        try {
            const skip = (page -1) *limit
            const referrals =await this.userReferralRepository.find({
                skip,
                take: limit,
                relations: ['users'],
                order: {
                    id: 'DESC'
                },
            });
            return referrals;  
        } catch (error) {
            throw error as InternalServerErrorException
        }
    }

    async findUserReferrals(userId:number, page:number =1, limit:number =10): Promise<Referral[]>{
        try {
            const skip = (page -1) *limit;
            const referrals =await this.userReferralRepository.find({
                skip,
                take: limit,
                where: {user: {id: userId}},
                relations: ['user', 'user.r'],
                order: {
                    id: 'DESC'
                },
            });
            return referrals;
            
        } catch (error) {
            throw error as InternalServerErrorException
        }
    }

    async updateUserReferrals(userId:number, body: UpdateReferralMetricsDto){
        try {
            const referral =await this.userReferralRepository.findOneBy({id: userId});
            if(referral){
                let userReferralLinkClicks =referral.clicks;
                let userReferralLinkVisits =referral.visits;
                const {clicks, visits} =body;
                if(clicks) userReferralLinkClicks +=1
                if(visits) userReferralLinkVisits +=1

                await this.userReferralRepository.update(
                    userId, 
                    {
                        clicks: userReferralLinkClicks, 
                        visits: userReferralLinkVisits
                    }
                )

            }
            return
        } catch (error) {
            throw error as BadRequestException
        }
    }

    async removeReferral(referralId:number){
        try {
            const referral =await this.userReferralRepository.findOneBy({id: referralId})
            if(referral){
                await this.userReferralRepository.delete({id: referralId})
                return
            }
        } catch (error) {
            return error as InternalServerErrorException
        }
    }
}
