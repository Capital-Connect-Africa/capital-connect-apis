import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyEligibilityRuleCascadeOnDelete1736488665849 implements MigrationInterface {
    name = 'ModifyEligibilityRuleCascadeOnDelete1736488665849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" DROP CONSTRAINT "FK_21422343ba675181dcb7cc38d49"`);
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" ADD CONSTRAINT "FK_21422343ba675181dcb7cc38d49" FOREIGN KEY ("rule") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" DROP CONSTRAINT "FK_21422343ba675181dcb7cc38d49"`);
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" ADD CONSTRAINT "FK_21422343ba675181dcb7cc38d49" FOREIGN KEY ("rule") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
