import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialCriterionDto } from './create-special-criterion.dto';

export class UpdateSpecialCriterionDto extends PartialType(CreateSpecialCriterionDto) {}
