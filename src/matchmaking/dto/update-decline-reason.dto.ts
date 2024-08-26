import { PartialType } from "@nestjs/mapped-types";
import { CreateDeclineReasonDto } from "./create-decline-reason.dto";

export class UpdateDeclineReasonDto extends PartialType(CreateDeclineReasonDto) {}