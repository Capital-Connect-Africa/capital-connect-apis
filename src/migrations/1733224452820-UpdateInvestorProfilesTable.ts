import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvestorProfilesTable1733224452820 implements MigrationInterface {
    name = 'UpdateInvestorProfilesTable1733224452820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP COLUMN "availableFunding"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD "availableFunding" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP COLUMN "availableFunding"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD "availableFunding" integer NOT NULL`);
    }
}
