import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySpecialCriteriaTable1740077935612 implements MigrationInterface {
    name = 'ModifySpecialCriteriaTable1740077935612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria" ADD "userId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria" DROP COLUMN "userId"`);
    }

}
