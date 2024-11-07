import { PartialType } from "@nestjs/mapped-types";
import { CreateEligibilityRuleDto } from "./create-eligibility-rules.dto";

export class UpdateEligibilityRuleDto extends PartialType(CreateEligibilityRuleDto) {}