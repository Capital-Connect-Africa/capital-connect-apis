import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryCodeDto } from './create-country-code.dto';

export class UpdateCountryCodeDto extends PartialType(CreateCountryCodeDto) {}
