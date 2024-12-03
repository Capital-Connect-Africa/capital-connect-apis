import { IsNotEmpty} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Operators } from "src/shared/enums/operators.enum";

export class CreateEligibilityRuleDto{

    @IsNotEmpty({message: 'user property required*'})
    @ApiProperty({description: 'Targeted user table column name', type: 'string'})
    userProperty: string;

    @IsNotEmpty({message: 'operator is required*'})
    @ApiProperty({description: 'Logical operators applied', enum: Operators})
    operator: Operators;

    @IsNotEmpty({message: 'description required*'})
    @ApiProperty({description: 'A message displayed to the user when validation against a property fails. Essentially custom errors', type: 'string'})
    description: string;
    
    @IsNotEmpty({message: 'value required*'})
    @ApiProperty({description: 'The value being validated against', type: 'string'})
    value: any;

}