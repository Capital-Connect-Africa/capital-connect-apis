import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySpecialCriteriaTable1730275268741 implements MigrationInterface {
    name = 'ModifySpecialCriteriaTable1730275268741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria" ADD "globalVisible" boolean NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria" DROP COLUMN "globalVisible"`);
    }

}
