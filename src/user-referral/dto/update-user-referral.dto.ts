import { PartialType } from '@nestjs/mapped-types';
import { CreateUserReferralDto } from './create-user-referral.dto';

export class UpdateUserReferralDto extends PartialType(CreateUserReferralDto) {}
