import { PartialType } from '@nestjs/swagger';
import { CreateAdvisorProfileDto } from './create-advisor_profile.dto';

export class UpdateAdvisorProfileDto extends PartialType(CreateAdvisorProfileDto) {}
