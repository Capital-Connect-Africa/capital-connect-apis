import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'MaxYear', async: false })
export class MaxYearConstraint implements ValidatorConstraintInterface {
    validate(value: number) {
        return value >= 2000 && value <= new Date().getFullYear();
    }

    defaultMessage(args: ValidationArguments) {
        return `The year must be between 2000 and ${new Date().getFullYear()}`;
    }
}