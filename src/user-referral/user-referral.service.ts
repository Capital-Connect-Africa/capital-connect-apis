import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { CreateUserReferralDto } from './dto/create-user-referral.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserReferralService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Referral)
        private readonly referralRepository: Repository<Referral>,
        private readonly jwtService: JwtService
    ){}

    async countClicks(referral: CreateUserReferralDto){
        try {

            const { referralId } =referral;

            const { userId }  =this.jwtService.decode(referralId) as {
                  userId: number 
            }

            const referrerRefferal =await this.referralRepository.findOne({
                where: {user: {id: userId}}
            });

            if(referrerRefferal) {
                referrerRefferal.clicks +=1;
                await this.referralRepository.save(referrerRefferal);
            }
            // refferal
            return
        } catch (error) {
            throw error as InternalServerErrorException
        }

    }

    async findReferrals(page:number =1, limit:number =10): Promise<Referral[]>{
        const skip = (page -1) *limit
        const referrals =await this.referralRepository.find({
            skip,
            take: limit,
            relations: ['users',],
            order: {
                id: 'DESC'
            },
        });
        return referrals;
    }

    findUserReferrals(){
    
    }

    updateReferral(){

    }

    findReferralById(){
        
    }
}
