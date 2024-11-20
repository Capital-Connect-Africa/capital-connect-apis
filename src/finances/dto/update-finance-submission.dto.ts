import { PartialType } from "@nestjs/mapped-types";
import { CreateFinanceSubmissionDto } from "./create-finance-submission.dto";

export class UpdateFinanceSubmissionDto extends PartialType(CreateFinanceSubmissionDto) {}