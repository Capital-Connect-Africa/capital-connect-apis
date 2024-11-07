import { IsNotEmpty} from "class-validator";
import { Operators } from "src/shared/enums/operators.enum";

export class CreateEligibilityRuleDto{

    @IsNotEmpty({message: 'user property required*'})
    userProperty: string;

    @IsNotEmpty({message: 'operator is required*'})
    operator: Operators;

    @IsNotEmpty({message: 'value required*'})
    value: any;

}